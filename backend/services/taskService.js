const taskRepository = require("../repositories/taskRepository");
const notificationService = require("./notificationService");
const activityService = require("./activityService");
const userRepository = require("../repositories/userRepository");

const TASK_STATES = require("../domain/task/taskStates");
const validateTaskTransition = require("../domain/task/taskValidator");
const taskSubmissionRepository = require("../repositories/taskSubmissionRepository");
const escrowRepository = require("../repositories/escrowRepository");
const escrowService = require("./escrowService");
const taskTimelineService = require("./taskTimelineService");

/* ===============================
   CREATE TASK
================================ */
const createTask = async (employerId, data) => {
  const task = await taskRepository.createTask({
    ...data,
    employer: employerId,
    status: TASK_STATES.OPEN,
    isDeleted: false,
    isRated: false,
  });

  const employer = await userRepository.findById(employerId);

  if (employer) {
    await activityService.logActivity({
      type: "task_posted",
      userId: employer._id,
      userName: employer.name,
      taskId: task._id,
      taskTitle: task.title,
    });
  }

  const admins = await userRepository.findByRole("admin");

  for (const admin of admins) {
    await notificationService.createNotification({
      user: admin._id,
      type: "task_created",
      message: `A new task "${task.title}" has been posted`,
      link: `/task/${task._id}`,
    });
  }

  return task;
};

/* ===============================
   ACCEPT TASK (Freelancer starts work)
================================ */
const acceptTask = async (taskId, freelancerId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  if (!task.assignedFreelancer) {
    throw new Error("No freelancer assigned to this task");
  }

  if (task.assignedFreelancer.toString() !== freelancerId.toString()) {
    throw new Error("Not authorized");
  }

  validateTaskTransition(task.status, TASK_STATES.IN_PROGRESS);

  /* ===============================
    CHECK ESCROW FUNDED
  ================================ */

  const escrow = await escrowRepository.findByTaskId(taskId);

  if (!escrow) {
    throw new Error("Escrow record not found for this task");
  }

  if (escrow.status !== "funded") {
    throw new Error("Task cannot start until payment is funded");
  }

  const updatedTask = await taskRepository.updateTaskStatus(
    taskId,
    TASK_STATES.IN_PROGRESS,
  );

  await taskTimelineService.logEvent({
    taskId: taskId,
    userId: freelancerId,
    type: "task_started",
    message: "Freelancer started working on the task",
  });

  return updatedTask;
};

/* ===============================
   SUBMIT TASK WORK
================================ */
const submitTask = async (taskId, freelancerId, submissionData) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  if (!task.assignedFreelancer) {
    throw new Error("No freelancer assigned to this task");
  }

  if (task.assignedFreelancer.toString() !== freelancerId.toString()) {
    throw new Error("Not authorized");
  }

  /* ===============================
   ENSURE TASK IS IN PROGRESS
================================ */

  if (
    task.status !== TASK_STATES.IN_PROGRESS &&
    task.status !== TASK_STATES.REVISION_REQUESTED
  ) {
    throw new Error(
      "Task must be in progress or revision requested to submit work",
    );
  }

  validateTaskTransition(task.status, TASK_STATES.SUBMITTED);

  /* create submission */

  const submission = await taskSubmissionRepository.createSubmission({
    task: taskId,
    freelancer: freelancerId,
    message: submissionData.message || "",
    links: submissionData.links || [],
    files: submissionData.files || [],
    screenshots: submissionData.screenshots || [],
  });

  /* update task status */

  const updatedTask = await taskRepository.updateTaskStatus(
    taskId,
    TASK_STATES.SUBMITTED,
    {
      submittedAt: new Date(),
    },
  );

  /* notify employer */

  try {
    await notificationService.createNotification({
      user: task.employer,
      type: "task_submitted",
      message: `Work submitted for task "${task.title}"`,
      link: `/task/${taskId}`,
    });
  } catch (err) {}

  /* activity log */

  const freelancer = await userRepository.findById(freelancerId);

  if (freelancer) {
    await activityService.logActivity({
      type: "task_submitted",
      userId: freelancer._id,
      userName: freelancer.name,
      taskId: task._id,
      taskTitle: task.title,
    });
  }

  await taskTimelineService.logEvent({
    taskId: taskId,
    userId: freelancerId,
    type: "task_submitted",
    message: "Freelancer submitted work for review",
  });

  return {
    task: updatedTask,
    submission,
  };
};

/* ===============================
   REQUEST REVISION
================================ */
const requestRevision = async (taskId, employerId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  if (task.employer.toString() !== employerId.toString()) {
    throw new Error("Not authorized");
  }

  validateTaskTransition(task.status, TASK_STATES.REVISION_REQUESTED);

  await taskTimelineService.logEvent({
    taskId: taskId,
    userId: employerId,
    type: "revision_requested",
    message: "Employer requested a revision",
  });

  return await taskRepository.updateTaskStatus(
    taskId,
    TASK_STATES.REVISION_REQUESTED,
  );
};

/* ===============================
   APPROVE SUBMISSION
================================ */
const approveSubmission = async (taskId, employerId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  if (task.employer.toString() !== employerId.toString()) {
    throw new Error("Not authorized");
  }

  validateTaskTransition(task.status, TASK_STATES.APPROVED);

  /* ===============================
   VERIFY SUBMISSION EXISTS
================================ */

  const latestSubmission =
    await taskSubmissionRepository.getLatestSubmission(taskId);

  if (!latestSubmission) {
    throw new Error("Cannot approve task without a submission");
  }

  /* ===============================
   RELEASE ESCROW
================================ */

  try {
    await escrowService.releaseEscrow(taskId);
  } catch (err) {
    console.error("Escrow release failed:", err.message);
  }

  await taskTimelineService.logEvent({
    taskId: taskId,
    userId: employerId,
    type: "task_approved",
    message: "Employer approved the submitted work",
  });

  /* ===============================
   MARK TASK APPROVED
================================ */

  const approvedTask = await taskRepository.updateTaskStatus(
    taskId,
    TASK_STATES.APPROVED,
    {
      approvedAt: new Date(),
    },
  );

  return approvedTask;
};

/* ===============================
   COMPLETE TASK
================================ */
const completeTask = async (taskId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  validateTaskTransition(task.status, TASK_STATES.COMPLETED);

  const updatedTask = await taskRepository.updateTaskStatus(
    taskId,
    TASK_STATES.COMPLETED,
  );

  const freelancer = await userRepository.findById(task.assignedFreelancer);

  if (freelancer) {
    await activityService.logActivity({
      type: "task_completed",
      userId: freelancer._id,
      userName: freelancer.name,
      taskId: task._id,
      taskTitle: task.title,
    });
  }

  return updatedTask;
};

/* ===============================
   CANCEL TASK
================================ */
const cancelTask = async (taskId, userId, role) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  if (role === "freelancer") {
    if (task.assignedFreelancer.toString() !== userId.toString()) {
      throw new Error("Not authorized");
    }
  }

  if (role === "employer") {
    if (task.employer.toString() !== userId.toString()) {
      throw new Error("Not authorized");
    }

    if (task.status === TASK_STATES.IN_PROGRESS) {
      throw new Error("Employer cannot cancel after work started");
    }
  }

  validateTaskTransition(task.status, TASK_STATES.CANCELLED);

  return await taskRepository.updateTaskStatus(taskId, TASK_STATES.CANCELLED);
};

/* ===============================
   RAISE DISPUTE
================================ */
const raiseDispute = async (taskId, userId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  if (
    task.employer.toString() !== userId.toString() &&
    (!task.assignedFreelancer ||
      task.assignedFreelancer.toString() !== userId.toString())
  ) {
    throw new Error("Not authorized");
  }

  validateTaskTransition(task.status, TASK_STATES.DISPUTED);

  return await taskRepository.updateTaskStatus(taskId, TASK_STATES.DISPUTED);
};

/* ===============================
   GET EMPLOYER DASHBOARD
================================ */
const getEmployerDashboard = async (employerId) => {
  const tasks = await taskRepository.getEmployerTasks(employerId);

  const open = [];
  const assigned = [];
  const in_progress = [];
  const submitted = [];
  const revision_requested = [];
  const approved = [];
  const completed = [];
  const cancelled = [];
  const disputed = [];

  tasks.forEach((task) => {
    switch (task.status) {
      case "open":
        open.push(task);
        break;

      case "assigned":
        assigned.push(task);
        break;

      case "in_progress":
        in_progress.push(task);
        break;

      case "submitted":
        submitted.push(task);
        break;

      case "revision_requested":
        revision_requested.push(task);
        break;

      case "approved":
        approved.push(task);
        break;

      case "completed":
        completed.push(task);
        break;

      case "cancelled":
        cancelled.push(task);
        break;

      case "disputed":
        disputed.push(task);
        break;
    }
  });

  return {
    open,
    assigned,
    in_progress,
    submitted,
    revision_requested,
    approved,
    completed,
    cancelled,
    disputed,
  };
};

/* ===============================
   GET ALL TASKS
================================ */
const getAllTasks = async (query) => {
  const { search, skill, minBudget, maxBudget } = query || {};

  const hasFilters = search || skill || minBudget || maxBudget;

  if (hasFilters) {
    return await taskRepository.searchTasks({
      search,
      skill,
      minBudget,
      maxBudget,
    });
  }

  return await taskRepository.getAllOpenTasks();
};

/* ===============================
   GET TASK BY ID
================================ */
const getTaskById = async (taskId) => {
  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

/* ===============================
   GET TASK TIMELINE
================================ */
const getTaskTimeline = async (taskId) => {
  const task = await taskRepository.findById(taskId);

  if (!task || task.isDeleted) {
    throw new Error("Task not found");
  }

  return await taskTimelineService.getTaskTimeline(taskId);
};

/* ===============================
   RATE FREELANCER
================================ */
const rateFreelancer = async (taskId, employerId, rating, review) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  if (task.employer.toString() !== employerId.toString()) {
    throw new Error("Not authorized");
  }

  if (task.status !== TASK_STATES.COMPLETED) {
    throw new Error("Task must be completed before rating");
  }

  task.isRated = true;
  task.rating = rating;
  task.review = review;

  return await taskRepository.saveTask(task);
};

/* ===============================
   ADMIN GET TASKS
================================ */
const getAllTasksAdmin = async () => {
  return await taskRepository.getAllTasksAdmin();
};

/* ===============================
   DELETE TASK
================================ */
const deleteTask = async (taskId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new Error("Task not found");

  task.isDeleted = true;

  return await taskRepository.saveTask(task);
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  getTaskTimeline,
  getEmployerDashboard,
  acceptTask,
  submitTask,
  requestRevision,
  approveSubmission,
  completeTask,
  cancelTask,
  raiseDispute,
  rateFreelancer,
  getAllTasksAdmin,
  deleteTask,
};
