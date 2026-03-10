const taskService = require("../services/taskService");

/* ===============================
   CREATE TASK
================================ */
exports.createTask = async (req, res) => {

  try {

    const task = await taskService.createTask(req.user._id, req.body);

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/* ===============================
   GET ALL TASKS
================================ */
exports.getAllTasks = async (req, res) => {

  try {

    const page = req.query.page ? Number(req.query.page) : null;

    const tasks = await taskService.getAllTasks(page);

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/* ===============================
   EMPLOYER DASHBOARD
================================ */
exports.getEmployerDashboard = async (req, res) => {

  try {

    const dashboard = await taskService.getEmployerDashboard(req.user._id);

    res.status(200).json(dashboard);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/* ===============================
   COMPLETE TASK
================================ */
exports.completeTask = async (req, res) => {

  try {

    await taskService.completeTask(req.params.taskId);

    res.status(200).json({
      message: "Task marked as completed"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

/* ===============================
   RATE FREELANCER
================================ */
exports.rateFreelancer = async (req, res) => {

  try {

    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    await taskService.rateFreelancer(
      req.params.taskId,
      req.user._id,
      rating,
      review
    );

    res.status(200).json({
      message: "Rating submitted successfully"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

/* ===============================
   ADMIN GET TASKS
================================ */
exports.getAllTasksAdmin = async (req, res) => {

  try {

    const page = req.query.page ? Number(req.query.page) : null;

    const tasks = await taskService.getAllTasksAdmin(page);

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/* ===============================
   DELETE TASK
================================ */
exports.deleteTaskAdmin = async (req, res) => {

  try {

    await taskService.deleteTask(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};