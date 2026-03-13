const applicationRepository = require("../repositories/applicationRepository");
const userRepository = require("../repositories/userRepository");
const taskRepository = require("../repositories/taskRepository");
const notificationService = require("./notificationService");
const activityService = require("./activityService");

const TASK_STATES = require("../domain/task/taskStates");
const validateTaskTransition = require("../domain/task/taskValidator");
const escrowService = require("./escrowService");

/* ===============================
   APPLY TO TASK
================================ */
const applyToTask = async (taskId, freelancerId) => {
  const task = await taskRepository.findById(taskId);

  if (!task || task.status !== TASK_STATES.OPEN) {
    throw new Error("Task not available for application");
  }

  const existingApplication =
    await applicationRepository.findByTaskAndFreelancer(taskId, freelancerId);

  if (existingApplication) {
    throw new Error("You already applied to this task");
  }

  const application = await applicationRepository.createApplication({
    task: taskId,
    freelancer: freelancerId,
    status: "applied",
  });

  await taskRepository.incrementApplicationsCount(taskId);

  const freelancer = await userRepository.findById(freelancerId);

  if (freelancer) {
    await activityService.logActivity({
      type: "task_applied",
      userId: freelancer._id,
      userName: freelancer.name,
      taskId: taskId,
    });
  }

  return application;
};

/* ===============================
   ASSIGN FREELANCER
================================ */
const assignFreelancer = async (taskId, applicationId, employerId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.employer.toString() !== employerId.toString()) {
    throw new Error("Not authorized");
  }

  validateTaskTransition(task.status, TASK_STATES.ASSIGNED);

  const selectedApplication =
    await applicationRepository.findById(applicationId);

  if (!selectedApplication) {
    throw new Error("Application not found");
  }

  const freelancerId = selectedApplication.freelancer;

  const updatedTask = await taskRepository.assignFreelancer(
    taskId,
    freelancerId,
  );

  selectedApplication.status = "accepted";
  await applicationRepository.saveApplication(selectedApplication);
  /* ===============================
   CREATE ESCROW (PENDING)
================================ */

  try {
    await escrowService.createTaskEscrow(
      taskId,
      task.employer,
      freelancerId,
      task.budgetAmount,
    );
  } catch (err) {
    console.error("Escrow creation failed:", err.message);
  }

  await applicationRepository.rejectOtherApplications(taskId, applicationId);

  /* notify freelancer */

  try {
    await notificationService.createNotification({
      user: freelancerId,
      type: "task_assigned",
      message: `You have been assigned to task "${task.title}"`,
      link: `/task/${taskId}`,
    });
  } catch (err) {}

  return {
    success: true,
    message: "Freelancer assigned successfully",
  };
};

module.exports = {
  applyToTask,
  assignFreelancer,
};
