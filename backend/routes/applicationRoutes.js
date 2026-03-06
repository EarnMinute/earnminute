const express = require("express");
const router = express.Router();

const {
  applyToTask,
  getApplicationsForTask,
  assignFreelancer,
  getFreelancerDashboard,
  getAllApplicationsAdmin,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

/* ===============================
   ADMIN ROUTES
================================= */

router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  getAllApplicationsAdmin
);

/* ===============================
   FREELANCER ROUTES
================================= */

// Freelancer dashboard (must stay before :taskId)
router.get(
  "/freelancer/dashboard",
  protect,
  restrictTo("freelancer"),
  getFreelancerDashboard
);

// Freelancer apply
router.post(
  "/:taskId",
  protect,
  restrictTo("freelancer"),
  applyToTask
);

/* ===============================
   EMPLOYER ROUTES
================================= */

// Employer view applications
router.get(
  "/:taskId",
  protect,
  restrictTo("employer"),
  getApplicationsForTask
);

// Employer assign freelancer
router.patch(
  "/:taskId/assign/:applicationId",
  protect,
  restrictTo("employer"),
  assignFreelancer
);

module.exports = router;