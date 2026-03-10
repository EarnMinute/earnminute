const Task = require("../models/Task");

/* ===============================
   CREATE TASK
================================ */
const createTask = async (data) => {
  return Task.create(data);
};

/* ===============================
   FIND TASK BY ID
================================ */
const findById = async (id) => {
  return Task.findById(id);
};

/* ===============================
   GET ALL PUBLIC TASKS
================================ */
const getAllOpenTasks = async () => {
  return Task.find({
    status: "open",
    isDeleted: { $ne: true },
  }).sort({ createdAt: -1 });
};

/* ===============================
   GET EMPLOYER TASKS
================================ */
const getEmployerTasks = async (employerId) => {
  return Task.find({
    employer: employerId,
    isDeleted: { $ne: true },
  })
    .populate("assignedFreelancer", "name rating")
    .sort({ createdAt: -1 });
};

/* ===============================
   SAVE TASK
================================ */
const saveTask = async (task) => {
  return task.save();
};

/* ===============================
   GET ADMIN TASKS
================================ */
const getAllTasksAdmin = async () => {
  return Task.find({ isDeleted: { $ne: true } })
    .populate("employer", "name email")
    .populate("assignedFreelancer", "name rating")
    .sort({ createdAt: -1 });
};

/* ===============================
   INCREMENT APPLICATION COUNT
================================ */
const incrementApplicationsCount = async (taskId) => {

  return Task.findByIdAndUpdate(
    taskId,
    { $inc: { applicationsCount: 1 } },
    { new: true }
  );

};

module.exports = {
  createTask,
  findById,
  getAllOpenTasks,
  getEmployerTasks,
  saveTask,
  getAllTasksAdmin,
  incrementApplicationsCount
};