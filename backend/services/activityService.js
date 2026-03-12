const activityRepository = require("../repositories/activityRepository");

/* ===============================
   LOG ACTIVITY
================================ */
const logActivity = async (data) => {
  return activityRepository.createActivity(data);
};

/* ===============================
   GET LIVE FEED
================================ */
const getLiveFeed = async () => {
  return activityRepository.getLatestActivities(5);
};

module.exports = {
  logActivity,
  getLiveFeed
};