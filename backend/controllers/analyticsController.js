const Task = require("../models/Task");
const Analytics = require("../models/Analytics");

// 🔹 PUBLIC HOMEPAGE STATS
exports.getPublicAnalytics = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({
      isDeleted: { $ne: true },
    });

    const completedTasks = await Task.find({
      status: "completed",
      isDeleted: { $ne: true },
    });

    const totalEarned = completedTasks.reduce(
      (sum, task) => sum + (task.budgetAmount || 0),
      0
    );

    res.status(200).json({
      totalTasks,
      totalEarned,
    });
  } catch (error) {
    res.status(500).json({
      message: "Analytics error",
      error: error.message,
    });
  }
};

// 🔹 Increment Website Visit
exports.incrementVisit = async () => {
  const today = new Date().toISOString().split("T")[0];

  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { visits: 1 } },
    { upsert: true, new: true }
  );
};

// 🔹 Increment Registration
exports.incrementRegistration = async () => {
  const today = new Date().toISOString().split("T")[0];

  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { registrations: 1 } },
    { upsert: true, new: true }
  );
};

// 🔹 Increment Login
exports.incrementLogin = async () => {
  const today = new Date().toISOString().split("T")[0];

  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { logins: 1 } },
    { upsert: true, new: true }
  );
};