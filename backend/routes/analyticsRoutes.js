const express = require("express");

const analyticsController = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const router = express.Router();

/* ======================================
   ADMIN ANALYTICS
====================================== */

router.get(
  "/admin/dashboard",
  protect,
  restrictTo("admin"),
  analyticsController.getAdminDashboardStats
);

module.exports = router;