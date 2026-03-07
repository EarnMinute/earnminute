const express = require("express");

const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const router = express.Router();

/* ======================================
   PUBLIC
====================================== */

router.get(
  "/freelancer/:id",
  userController.getFreelancerProfile
);

/* ======================================
   ADMIN ROUTES
====================================== */

router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  userController.getAllUsersAdmin
);

router.patch(
  "/admin/role/:id",
  protect,
  restrictTo("admin"),
  userController.changeUserRole
);

router.delete(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  userController.deleteUserAdmin
);

module.exports = router;