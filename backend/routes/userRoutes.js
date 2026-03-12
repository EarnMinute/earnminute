const express = require("express");
const router = express.Router();

const {
  getFreelancerProfile,
  getEmployerProfile,
  updateProfile,
  getAllUsersAdmin,
  changeUserRole,
  deleteUserAdmin
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

/* =========================
   PUBLIC ROUTES
========================= */
router.get("/freelancer/:id", getFreelancerProfile);
router.get("/employer/:id", getEmployerProfile);

router.patch("/profile", protect, updateProfile);

/* =========================
   ADMIN ROUTES (SECURED)
========================= */

// Get all users
router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  getAllUsersAdmin
);

// Change user role
router.patch(
  "/admin/role/:id",
  protect,
  restrictTo("admin"),
  changeUserRole
);

// Delete user
router.delete(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  deleteUserAdmin
);

module.exports = router;