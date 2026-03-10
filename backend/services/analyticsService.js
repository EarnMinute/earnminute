const analyticsRepository = require("../repositories/analyticsRepository");

/* ===============================
   VISIT IP CACHE
================================ */
const visitCache = new Map();

/* ===============================
   GET TODAY DATE
================================ */
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

/* ===============================
   INCREMENT VISIT (1 PER IP/DAY)
================================ */
const incrementVisit = async (ip) => {

  const today = getToday();
  const key = `${ip}-${today}`;

  if (visitCache.has(key)) {
    return;
  }

  visitCache.set(key, true);

  return analyticsRepository.incrementVisits(today, 1);
};

/* ===============================
   INCREMENT REGISTRATION
================================ */
const incrementRegistration = async () => {
  const today = getToday();
  return analyticsRepository.incrementRegistrations(today);
};

/* ===============================
   INCREMENT LOGIN
================================ */
const incrementLogin = async () => {
  const today = getToday();
  return analyticsRepository.incrementLogins(today);
};

/* ===============================
   GET ANALYTICS HISTORY
================================ */
const getAnalyticsHistory = async () => {
  return analyticsRepository.getAnalyticsHistory(30);
};

module.exports = {
  incrementVisit,
  incrementRegistration,
  incrementLogin,
  getAnalyticsHistory
};