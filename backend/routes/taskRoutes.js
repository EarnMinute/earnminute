const express = require("express");

const taskController = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const router = express.Router();

/* ======================================
   PUBLIC ROUTES
====================================== */

router.get("/", taskController.getAllTasks);

/* ======================================
   EMPLOYER ROUTES
====================================== */

router.get(
  "/employer/dashboard",
  protect,
  restrictTo("employer"),
  taskController.getEmployerDashboard
);

router.post(
  "/",
  protect,
  restrictTo("employer"),
  taskController.createTask
);

router.patch(
  "/:taskId/complete",
  protect,
  restrictTo("employer"),
  taskController.completeTask
);

router.patch(
  "/:taskId/rate",
  protect,
  restrictTo("employer"),
  taskController.rateFreelancer
);

/* ======================================
   ADMIN ROUTES
====================================== */

router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  taskController.getAllTasksAdmin
);

router.delete(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  taskController.deleteTaskAdmin
);

module.exports = router;