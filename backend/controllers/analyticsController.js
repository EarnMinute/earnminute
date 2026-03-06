const Task = require("../models/Task");
const User = require("../models/User");
const Application = require("../models/Application");
const Analytics = require("../models/Analytics");

/* ===============================
   PUBLIC HOMEPAGE STATS
================================ */
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

/* ===============================
   ADMIN DASHBOARD + CHART ANALYTICS
================================ */
exports.getAdminDashboardAnalytics = async (req, res) => {
  try {

    /* ===============================
       PLATFORM COUNTS
    ================================= */

    const totalUsers = await User.countDocuments();

    const totalFreelancers = await User.countDocuments({
      role: "freelancer",
    });

    const totalEmployers = await User.countDocuments({
      role: "employer",
    });

    const totalTasks = await Task.countDocuments({
      isDeleted: { $ne: true },
    });

    const totalApplications = await Application.countDocuments();

    /* ===============================
       ACTIVE TODAY
    ================================= */

    const today = new Date().toISOString().split("T")[0];

    const todayAnalytics = await Analytics.findOne({ date: today });

    const activeToday = todayAnalytics ? todayAnalytics.logins : 0;

    /* ===============================
       RECENT DATA
    ================================= */

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");

    const recentTasks = await Task.find({
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("employer", "name");

    /* ===============================
       TRAFFIC CHART DATA
    ================================= */

    const analyticsHistory = await Analytics.find()
      .sort({ date: 1 })
      .limit(30);

    /* ===============================
       TASKS PER DAY
    ================================= */

    const tasksPerDay = await Task.aggregate([
      {
        $match: { isDeleted: { $ne: true } }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          tasks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    /* ===============================
       MERGE DATA FOR CHARTS
    ================================= */

    const chartData = analyticsHistory.map(day => {

      const taskDay = tasksPerDay.find(t => t._id === day.date);

      return {
        date: day.date,
        visits: day.visits || 0,
        registrations: day.registrations || 0,
        logins: day.logins || 0,
        tasks: taskDay ? taskDay.tasks : 0
      };

    });

    /* ===============================
       FINAL RESPONSE
    ================================= */

    res.status(200).json({
      totalUsers,
      totalFreelancers,
      totalEmployers,
      totalTasks,
      totalApplications,
      activeToday,
      recentUsers,
      recentTasks,
      chartData
    });

  } catch (error) {

    res.status(500).json({
      message: "Admin analytics error",
      error: error.message,
    });

  }
};

/* ===============================
   INCREMENT VISIT
================================ */
exports.incrementVisit = async () => {

  const today = new Date().toISOString().split("T")[0];

  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { visits: 1 } },
    { upsert: true, new: true }
  );

};

/* ===============================
   INCREMENT REGISTRATION
================================ */
exports.incrementRegistration = async () => {

  const today = new Date().toISOString().split("T")[0];

  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { registrations: 1 } },
    { upsert: true, new: true }
  );

};

/* ===============================
   INCREMENT LOGIN
================================ */
exports.incrementLogin = async () => {

  const today = new Date().toISOString().split("T")[0];

  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { logins: 1 } },
    { upsert: true, new: true }
  );

};