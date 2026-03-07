const express = require("express");

const applicationController = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { applicationLimiter } = require("../middleware/abuseLimiter");

const router = express.Router();

/* ======================================
   FREELANCER ROUTES
====================================== */

router.post(
  "/:taskId/apply",
  protect,
  restrictTo("freelancer"),
  applicationLimiter,
  applicationController.applyToTask
);

router.get(
  "/my",
  protect,
  restrictTo("freelancer"),
  applicationController.getMyApplications
);

/* ======================================
   EMPLOYER ROUTES
====================================== */

router.get(
  "/task/:taskId",
  protect,
  restrictTo("employer"),
  applicationController.getApplicationsForTask
);

router.patch(
  "/:taskId/assign/:applicationId",
  protect,
  restrictTo("employer"),
  applicationController.assignFreelancer
);

module.exports = router;