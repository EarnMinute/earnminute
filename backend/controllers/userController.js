const User = require("../models/User");

/* ==================================
   PUBLIC FREELANCER PROFILE
================================== */
exports.getFreelancerProfile = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select(
      "name rating createdAt"
    );

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ==================================
   ADMIN: GET ALL USERS
================================== */
exports.getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("name email role createdAt");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ==================================
   ADMIN: CHANGE USER ROLE
================================== */
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["freelancer", "employer", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Role updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

/* ==================================
   ADMIN: DELETE USER
================================== */
exports.deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};