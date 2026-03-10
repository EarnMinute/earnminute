const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  getEmployerDashboard,
  completeTask,
  rateFreelancer,
  getAllTasksAdmin,
  deleteTask
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

/* ===============================
   PUBLIC TASK ROUTES
================================ */

/*
Browse tasks
Supports filters:
?search=
?skill=
?minBudget=
?maxBudget=
?page=
*/
router.get("/", getAllTasks);

router.get("/:id", getTaskById);


/* ===============================
   EMPLOYER ROUTES
================================ */

router.post(
  "/",
  protect,
  restrictTo("employer"),
  createTask
);

router.get(
  "/employer/dashboard",
  protect,
  restrictTo("employer"),
  getEmployerDashboard
);

router.patch(
  "/:id/complete",
  protect,
  restrictTo("employer"),
  completeTask
);

router.post(
  "/:id/rate",
  protect,
  restrictTo("employer"),
  rateFreelancer
);


/* ===============================
   ADMIN ROUTES
================================ */

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
  deleteTask
);

module.exports = router;