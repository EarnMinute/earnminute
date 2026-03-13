const taskService = require("../services/taskService");

/* ===============================
   CREATE TASK
================================ */
const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   GET ALL TASKS
================================ */
const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.query);

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   GET TASK BY ID
================================ */
const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   GET TASK TIMELINE
================================ */
const getTaskTimeline = async (req, res) => {
  try {
    const timeline = await taskService.getTaskTimeline(req.params.id);

    res.json({
      success: true,
      timeline,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
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
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   START TASK (Freelancer)
================================ */
const startTask = async (req, res) => {
  try {
    const task = await taskService.acceptTask(req.params.id, req.user._id);

    res.json({
      success: true,
      message: "Task started",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   SUBMIT TASK
================================ */
const submitTask = async (req, res) => {
  try {
    const result = await taskService.submitTask(
      req.params.id,
      req.user._id,
      req.body,
    );

    res.json({
      success: true,
      message: "Task submitted",
      ...result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   REQUEST REVISION
================================ */
const requestRevision = async (req, res) => {
  try {
    const task = await taskService.requestRevision(req.params.id, req.user._id);

    res.json({
      success: true,
      message: "Revision requested",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   APPROVE SUBMISSION
================================ */
const approveSubmission = async (req, res) => {
  try {
    const task = await taskService.approveSubmission(
      req.params.id,
      req.user._id,
    );

    res.json({
      success: true,
      message: "Submission approved",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   CANCEL TASK
================================ */
const cancelTask = async (req, res) => {
  try {
    const task = await taskService.cancelTask(
      req.params.id,
      req.user._id,
      req.user.role,
    );

    res.json({
      success: true,
      message: "Task cancelled",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   RAISE DISPUTE
================================ */
const raiseDispute = async (req, res) => {
  try {
    const task = await taskService.raiseDispute(req.params.id, req.user._id);

    res.json({
      success: true,
      message: "Dispute raised",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      review,
    );

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   ADMIN GET TASKS
================================ */
const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasksAdmin();

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   DELETE TASK
================================ */
const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  getTaskTimeline,
  getEmployerDashboard,
  startTask,
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
