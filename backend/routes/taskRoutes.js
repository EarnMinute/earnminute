const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  getTaskTimeline,
  getEmployerDashboard,
  startTask,
  submitTask,
  requestRevision,
  approveSubmission,
  completeTask,
  cancelTask,
  raiseDispute,
  rateFreelancer,
  getAllTasksAdmin,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

/* ===============================
   PUBLIC TASK ROUTES
================================ */

router.get("/", getAllTasks);

/* ===============================
   EMPLOYER
================================ */

router.post("/", protect, restrictTo("employer"), createTask);

router.get(
  "/employer/dashboard",
  protect,
  restrictTo("employer"),
  getEmployerDashboard,
);

router.patch("/:id/revision", protect, restrictTo("employer"), requestRevision);

router.patch(
  "/:id/approve",
  protect,
  restrictTo("employer"),
  approveSubmission,
);

router.patch("/:id/complete", protect, restrictTo("employer"), completeTask);

router.patch("/:id/cancel", protect, cancelTask);

router.post("/:id/rate", protect, restrictTo("employer"), rateFreelancer);

/* ===============================
   FREELANCER
================================ */

router.patch("/:id/start", protect, restrictTo("freelancer"), startTask);

router.patch("/:id/submit", protect, restrictTo("freelancer"), submitTask);

router.patch("/:id/dispute", protect, raiseDispute);

/* ===============================
   ADMIN
================================ */

router.get("/admin/all", protect, restrictTo("admin"), getAllTasksAdmin);

router.delete("/:id", protect, restrictTo("admin"), deleteTask);

/* ===============================
   TASK TIMELINE
================================ */

router.get("/:id/timeline", protect, getTaskTimeline);

/* ===============================
   TASK DETAILS (KEEP LAST)
================================ */

router.get("/:id", getTaskById);

module.exports = router;
