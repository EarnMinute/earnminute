const taskTimelineRepository = require("../repositories/taskTimelineRepository");

/* ===============================
   LOG TIMELINE EVENT
================================ */

const logEvent = async ({
  taskId,
  userId = null,
  type,
  message,
  metadata = {},
}) => {
  try {
    await taskTimelineRepository.createEvent({
      task: taskId,
      user: userId,
      type,
      message,
      metadata,
    });
  } catch (err) {
    console.error("Timeline logging failed:", err.message);
  }
};

/* ===============================
   GET TASK TIMELINE
================================ */
const getTaskTimeline = async (taskId) => {
  return await taskTimelineRepository.getTaskTimeline(taskId);
};

module.exports = {
  logEvent,
  getTaskTimeline,
};
