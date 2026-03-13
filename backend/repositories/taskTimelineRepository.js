const TaskTimeline = require("../models/TaskTimeline");

/* ===============================
   CREATE TIMELINE EVENT
================================ */

const createEvent = async (data) => {
  return await TaskTimeline.create(data);
};

/* ===============================
   GET TASK TIMELINE
================================ */

const getTaskTimeline = async (taskId) => {
  return await TaskTimeline.find({ task: taskId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
};

module.exports = {
  createEvent,
  getTaskTimeline,
};
