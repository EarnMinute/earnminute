const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getEmployerDashboard,
  completeTask,
  rateFreelancer,
  getAllTasksAdmin,
  deleteTaskAdmin,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

/* ===============================
   PUBLIC ROUTES
================================= */
router.get("/", getAllTasks);

/* ===============================
   EMPLOYER ROUTES
================================= */
router.get(
  "/employer/dashboard",
  protect,
  restrictTo("employer"),
  getEmployerDashboard
);

router.post(
  "/",
  protect,
  restrictTo("employer"),
  createTask
);

router.patch(
  "/:taskId/complete",
  protect,
  restrictTo("employer"),
  completeTask
);

router.patch(
  "/:taskId/rate",
  protect,
  restrictTo("employer"),
  rateFreelancer
);

/* ===============================
   ADMIN ROUTES
================================= */

router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  getAllTasksAdmin
);

router.delete(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  deleteTaskAdmin
);

module.exports = router;