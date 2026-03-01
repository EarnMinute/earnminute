const express = require("express");
const router = express.Router();

const {
  applyToTask,
  getApplicationsForTask,
  assignFreelancer,
  getFreelancerDashboard,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

// 🔹 Freelancer dashboard (MUST be before :taskId route)
router.get(
  "/freelancer/dashboard",
  protect,
  restrictTo("freelancer"),
  getFreelancerDashboard
);

// 🔹 Freelancer apply
router.post(
  "/:taskId",
  protect,
  restrictTo("freelancer"),
  applyToTask
);

// 🔹 Employer view applications
router.get(
  "/:taskId",
  protect,
  restrictTo("employer"),
  getApplicationsForTask
);

// 🔹 Employer assign
router.patch(
  "/:taskId/assign/:applicationId",
  protect,
  restrictTo("employer"),
  assignFreelancer
);

module.exports = router;