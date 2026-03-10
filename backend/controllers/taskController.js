const taskService = require("../services/taskService");

/* ===============================
   CREATE TASK
================================ */
const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);

    res.status(201).json({
      success: true,
      task
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

/* ===============================
   GET ALL TASKS (WITH SEARCH)
================================ */
const getAllTasks = async (req, res) => {

  try {

    const tasks = await taskService.getAllTasks(req.query);

    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* ===============================
   GET SINGLE TASK
================================ */
const getTaskById = async (req, res) => {

  try {

    const task = await taskService.getTaskById(req.params.id);

    res.json({
      success: true,
      task
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};



/* ===============================
   EMPLOYER DASHBOARD
================================ */
const getEmployerDashboard = async (req, res) => {

  try {

    const dashboard = await taskService.getEmployerDashboard(req.user._id);

    res.json({
      success: true,
      dashboard
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ===============================
   COMPLETE TASK
================================ */
const completeTask = async (req, res) => {

  try {

    const task = await taskService.completeTask(req.params.id);

    res.json({
      success: true,
      task
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

/* ===============================
   RATE FREELANCER
================================ */
const rateFreelancer = async (req, res) => {

  try {

    const { rating, review } = req.body;

    const task = await taskService.rateFreelancer(
      req.params.id,
      req.user._id,
      rating,
      review
    );

    res.json({
      success: true,
      task
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

/* ===============================
   ADMIN GET TASKS
================================ */
const getAllTasksAdmin = async (req, res) => {

  try {

    const page = req.query.page ? Number(req.query.page) : null;

    const tasks = await taskService.getAllTasksAdmin(page);

    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ===============================
   DELETE TASK (ADMIN)
================================ */
const deleteTask = async (req, res) => {

  try {

    await taskService.deleteTask(req.params.id);

    res.json({
      success: true,
      message: "Task deleted"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  getEmployerDashboard,
  completeTask,
  rateFreelancer,
  getAllTasksAdmin,
  deleteTask
};