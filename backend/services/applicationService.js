const Application = require("../models/Application");
const taskRepository = require("../repositories/taskRepository");
const notificationService = require("./notificationService");
const activityService = require("./activityService");
const User = require("../models/User");

/* ===============================
   APPLY TO TASK
================================ */
const applyToTask = async (taskId, freelancerId) => {

  const existingApplication = await Application.findOne({
    task: taskId,
    freelancer: freelancerId
  });

  if (existingApplication) {
    throw new Error("You already applied to this task");
  }

  const application = await Application.create({
    task: taskId,
    freelancer: freelancerId,
    status: "applied"
  });

  /* Atomic increment (race-condition safe) */
  await taskRepository.incrementApplicationsCount(taskId);

const freelancer = await User.findById(freelancerId);

if (freelancer) {
  await activityService.logActivity({
    type: "task_applied",
    userId: freelancer._id,
    userName: freelancer.name,
    taskId: taskId
  });
}

  /* ===============================
     NOTIFY EMPLOYER
  ================================ */
  const task = await taskRepository.findById(taskId);

  if (task && task.employer) {
    await notificationService.createNotification({
      user: task.employer,
      type: "application_received",
      message: "You received a new application for your task",
      link: `/task/${taskId}`
    });
  }

  return application;
};

module.exports = {
  applyToTask
};