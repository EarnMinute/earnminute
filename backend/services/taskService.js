const taskRepository = require("../repositories/taskRepository");
const Application = require("../models/Application");
const Task = require("../models/Task");

/* ===============================
   CREATE TASK
================================ */
const createTask = async (employerId, data) => {

  const task = await taskRepository.createTask({
    ...data,
    employer: employerId,
    status: "open",
    isDeleted: false,
    isRated: false
  });

  return task;
};

/* ===============================
   GET ALL TASKS (WITH SEARCH)
================================ */
const getAllTasks = async (queryParams) => {

  const page = queryParams.page ? Number(queryParams.page) : null;

  const filters = {
    search: queryParams.search || null,
    skill: queryParams.skill || null,
    minBudget: queryParams.minBudget || null,
    maxBudget: queryParams.maxBudget || null
  };

  const hasFilters =
    filters.search ||
    filters.skill ||
    filters.minBudget ||
    filters.maxBudget;

  const tasks = hasFilters
    ? await taskRepository.searchTasks(filters)
    : await taskRepository.getAllOpenTasks();

  if (!page) return tasks;

  const limit = 20;
  const start = (page - 1) * limit;

  const paginatedTasks = tasks.slice(start, start + limit);

  return {
    page,
    totalPages: Math.ceil(tasks.length / limit),
    totalTasks: tasks.length,
    tasks: paginatedTasks
  };

};

/* ===============================
   GET EMPLOYER DASHBOARD
================================ */
const getEmployerDashboard = async (employerId) => {

  const tasks = await taskRepository.getEmployerTasks(employerId);

  const open = [];
  const assigned = [];
  const completed = [];

  tasks.forEach((task) => {

    if (task.status === "open") open.push(task);
    if (task.status === "assigned") assigned.push(task);
    if (task.status === "completed") completed.push(task);

  });

  return { open, assigned, completed };
};

/* ===============================
   COMPLETE TASK
================================ */
const completeTask = async (taskId) => {

  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.status !== "assigned") {
    throw new Error("Task must be assigned before completing");
  }

  task.status = "completed";
  task.isRated = false;

  await taskRepository.saveTask(task);

  return task;
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

  if (task.status !== "completed") {
    throw new Error("Task must be completed before rating");
  }

  if (task.isRated) {
    throw new Error("Task already rated");
  }

  task.isRated = true;
  task.rating = rating;
  task.review = review;

  await taskRepository.saveTask(task);

  return task;
};

/* ===============================
   ADMIN GET TASKS (OPTIMIZED)
================================ */
const getAllTasksAdmin = async (page) => {

  const limit = 20;
  const skip = page ? (page - 1) * limit : 0;

  const tasks = await Task.aggregate([

    {
      $match: { isDeleted: { $ne: true } }
    },

    {
      $lookup: {
        from: "users",
        localField: "employer",
        foreignField: "_id",
        as: "employer"
      }
    },

    {
      $unwind: {
        path: "$employer",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "assignedFreelancer",
        foreignField: "_id",
        as: "assignedFreelancer"
      }
    },

    {
      $unwind: {
        path: "$assignedFreelancer",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "task",
        as: "applications"
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "applications.freelancer",
        foreignField: "_id",
        as: "freelancers"
      }
    },

    {
      $sort: { createdAt: -1 }
    }

  ]);

  const formattedTasks = tasks.map((task) => {

    const applications = task.applications.map((app) => {

      const freelancer = task.freelancers.find(
        (f) => f._id.toString() === app.freelancer.toString()
      );

      return {
        ...app,
        freelancer: freelancer
          ? { _id: freelancer._id, name: freelancer.name, rating: freelancer.rating }
          : null
      };

    });

    return {
      ...task,
      applications
    };

  });

  if (!page) return formattedTasks;

  const paginated = formattedTasks.slice(skip, skip + limit);

  return {
    page,
    totalPages: Math.ceil(formattedTasks.length / limit),
    totalTasks: formattedTasks.length,
    tasks: paginated
  };

};

/* ===============================
   DELETE TASK
================================ */
const deleteTask = async (taskId) => {

  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  task.isDeleted = true;

  await taskRepository.saveTask(task);

  return true;
};

module.exports = {
  createTask,
  getAllTasks,
  getEmployerDashboard,
  completeTask,
  rateFreelancer,
  getAllTasksAdmin,
  deleteTask
};