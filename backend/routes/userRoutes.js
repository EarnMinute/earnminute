const express = require("express");
const router = express.Router();

const {
  getFreelancerProfile,
  getAllUsersAdmin,
  changeUserRole,
  deleteUserAdmin,
} = require("../controllers/userController");

/* =========================
   PUBLIC
========================= */
router.get("/freelancer/:id", getFreelancerProfile);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/admin/all", getAllUsersAdmin);
router.patch("/admin/role/:id", changeUserRole);
router.delete("/admin/:id", deleteUserAdmin);

module.exports = router;