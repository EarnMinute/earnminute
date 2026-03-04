const User = require("../models/User");

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