const Activity = require("../models/Activity");

/* ===============================
   CREATE ACTIVITY
================================ */
const createActivity = async (data) => {
  return Activity.create(data);
};

/* ===============================
   GET LATEST ACTIVITIES
================================ */
const getLatestActivities = async (limit = 5) => {
  return Activity.find()
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = {
  createActivity,
  getLatestActivities
};