const userService = require("../services/userService");
const User = require("../models/User");

/* ==================================
   PUBLIC FREELANCER PROFILE
================================== */
exports.getFreelancerProfile = async (req, res) => {
  try {

    const freelancer = await userService.getFreelancerProfile(req.params.id);

    res.json(freelancer);

  } catch (error) {

    if (error.message === "Freelancer not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* ==================================
   PUBLIC EMPLOYER PROFILE
================================== */
exports.getEmployerProfile = async (req, res) => {
  try {

    const employer = await userService.getEmployerProfile(req.params.id);

    res.json(employer);

  } catch (error) {

    if (error.message === "Employer not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* ==================================
   UPDATE OWN PROFILE
================================== */
exports.updateProfile = async (req, res) => {
  try {

    const updatedUser = await userService.updateProfile(
      req.user._id,
      req.body
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {

    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ==================================
   ADMIN: GET ALL USERS
================================== */
exports.getAllUsersAdmin = async (req, res) => {
  try {

    const page = req.query.page ? Number(req.query.page) : null;

    if (!page) {
      const users = await User.find()
        .sort({ createdAt: -1 })
        .select("name email role createdAt");

      return res.json(users);
    }

    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name email role createdAt");

    const totalUsers = await User.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users
    });

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