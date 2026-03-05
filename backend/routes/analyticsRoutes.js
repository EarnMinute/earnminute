const express = require("express");
const router = express.Router();

const {
  getPublicAnalytics,
  getAdminDashboardAnalytics,
} = require("../controllers/analyticsController");

router.get("/public", getPublicAnalytics);

// Admin dashboard stats
router.get("/admin-dashboard", getAdminDashboardAnalytics);

module.exports = router;