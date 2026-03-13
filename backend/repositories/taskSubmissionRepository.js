const TaskSubmission = require("../models/TaskSubmission");

/* ===============================
   CREATE SUBMISSION
================================ */
const createSubmission = async (data) => {
  return await TaskSubmission.create(data);
};

/* ===============================
   GET TASK SUBMISSIONS
================================ */
const getTaskSubmissions = async (taskId) => {
  return await TaskSubmission.find({ task: taskId })
    .populate("freelancer", "name rating")
    .sort({ createdAt: -1 });
};

/* ===============================
   GET LATEST SUBMISSION
================================ */
const getLatestSubmission = async (taskId) => {
  return await TaskSubmission.findOne({ task: taskId }).sort({ createdAt: -1 });
};

module.exports = {
  createSubmission,
  getTaskSubmissions,
  getLatestSubmission,
};
