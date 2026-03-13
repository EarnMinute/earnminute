const Task = require("../models/Task");

/* ===============================
   CREATE TASK
================================ */
const createTask = async (data) => {
  return await Task.create(data);
};

/* ===============================
   GET ALL OPEN TASKS
================================ */
const getAllOpenTasks = async () => {
  return await Task.find({
    status: "open",
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

/* ===============================
   SEARCH TASKS
================================ */
const searchTasks = async (filters) => {
  const query = {
    status: "open",
    isDeleted: false,
  };

  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  if (filters.skill) {
    query.skills = { $regex: filters.skill, $options: "i" };
  }

  if (filters.minBudget || filters.maxBudget) {
    query.budgetAmount = {};

    if (filters.minBudget) {
      query.budgetAmount.$gte = Number(filters.minBudget);
    }

    if (filters.maxBudget) {
      query.budgetAmount.$lte = Number(filters.maxBudget);
    }
  }

  return await Task.find(query).sort({ createdAt: -1 });
};

/* ===============================
   GET TASK BY ID
================================ */
const getTaskById = async (taskId) => {
  return await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate("employer", "name rating");
};

/* ===============================
   GET EMPLOYER TASKS
================================ */
const getEmployerTasks = async (employerId) => {
  return await Task.find({
    employer: employerId,
    isDeleted: false,
  })
    .populate("assignedFreelancer", "name rating")
    .sort({ createdAt: -1 });
};

/* ===============================
   GET ALL TASKS (ADMIN)
================================ */
const getAllTasksAdmin = async () => {
  return await Task.find({
    isDeleted: false,
  })
    .populate("employer", "name rating")
    .populate("assignedFreelancer", "name rating")
    .sort({ createdAt: -1 });
};

/* ===============================
   FIND TASK
================================ */
const findById = async (id) => {
  return await Task.findById(id);
};

/* ===============================
   SAVE TASK
================================ */
const saveTask = async (task) => {
  return await task.save();
};

/* ===============================
   ASSIGN FREELANCER
================================ */
const assignFreelancer = async (taskId, freelancerId) => {
  return await Task.findByIdAndUpdate(
    taskId,
    {
      status: "assigned",
      assignedFreelancer: freelancerId,
    },
    { new: true },
  );
};

/* ===============================
   UPDATE TASK STATUS
================================ */
const updateTaskStatus = async (taskId, status, extra = {}) => {
  return await Task.findByIdAndUpdate(
    taskId,
    {
      status,
      ...extra,
    },
    { new: true },
  );
};

/* ===============================
   INCREMENT APPLICATION COUNT
================================ */
const incrementApplicationsCount = async (taskId) => {
  return await Task.findByIdAndUpdate(taskId, {
    $inc: { applicationsCount: 1 },
  });
};

module.exports = {
  createTask,
  getAllOpenTasks,
  searchTasks,
  getTaskById,
  getEmployerTasks,
  getAllTasksAdmin,
  findById,
  saveTask,
  assignFreelancer,
  updateTaskStatus,
  incrementApplicationsCount,
};
