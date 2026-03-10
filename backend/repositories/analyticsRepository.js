const Analytics = require("../models/Analytics");

/* ===============================
   FIND ANALYTICS BY DATE
================================ */
const findByDate = async (date) => {
  return Analytics.findOne({ date });
};

/* ===============================
   INCREMENT VISITS
================================ */
const incrementVisits = async (date, count = 1) => {
  return Analytics.findOneAndUpdate(
    { date },
    { $inc: { visits: count } },
    { upsert: true, new: true }
  );
};

/* ===============================
   INCREMENT REGISTRATIONS
================================ */
const incrementRegistrations = async (date) => {
  return Analytics.findOneAndUpdate(
    { date },
    { $inc: { registrations: 1 } },
    { upsert: true, new: true }
  );
};

/* ===============================
   INCREMENT LOGINS
================================ */
const incrementLogins = async (date) => {
  return Analytics.findOneAndUpdate(
    { date },
    { $inc: { logins: 1 } },
    { upsert: true, new: true }
  );
};

/* ===============================
   GET ANALYTICS HISTORY
================================ */
const getAnalyticsHistory = async (limit = 30) => {
  return Analytics.find()
    .sort({ date: 1 })
    .limit(limit);
};

module.exports = {
  findByDate,
  incrementVisits,
  incrementRegistrations,
  incrementLogins,
  getAnalyticsHistory
};