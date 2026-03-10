const express = require("express");
const router = express.Router();

const {
  getPublicAnalytics,
  getAdminDashboardAnalytics,
  getAdminCharts,
  trackVisit
} = require("../controllers/analyticsController");

router.get("/public", getPublicAnalytics);

// Admin dashboard stats
router.get("/admin-dashboard", getAdminDashboardAnalytics);

// Admin charts
router.get("/admin-charts", getAdminCharts);

// Track visit (1 per IP per day)
router.post("/visit", trackVisit);

module.exports = router;