const Application = require("../models/Application");
const taskRepository = require("../repositories/taskRepository");

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

  return application;
};

module.exports = {
  applyToTask
};