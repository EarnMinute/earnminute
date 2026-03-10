const Task = require("../models/Task");
const User = require("../models/User");
const Application = require("../models/Application");
const Analytics = require("../models/Analytics");

const analyticsService = require("../services/analyticsService");

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
   ADMIN DASHBOARD ANALYTICS
================================ */
exports.getAdminDashboardAnalytics = async (req, res) => {
  try {

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

    const today = new Date().toISOString().split("T")[0];

    const todayAnalytics = await Analytics.findOne({ date: today });

    const activeToday = todayAnalytics ? todayAnalytics.logins : 0;

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

    res.status(200).json({
      totalUsers,
      totalFreelancers,
      totalEmployers,
      totalTasks,
      totalApplications,
      activeToday,
      recentUsers,
      recentTasks,
    });

  } catch (error) {

    res.status(500).json({
      message: "Admin analytics error",
      error: error.message,
    });

  }
};

/* ===============================
   ADMIN CHART DATA ONLY
================================ */
exports.getAdminCharts = async (req, res) => {
  try {

    const analyticsHistory = await Analytics.find();

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
      }
    ]);

    const historyMap = new Map();

    analyticsHistory.forEach(day => {
      historyMap.set(day.date, day);
    });

    const taskMap = new Map();

    tasksPerDay.forEach(t => {
      taskMap.set(t._id, t.tasks);
    });

    const chartData = [];

    for (let i = 29; i >= 0; i--) {

      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().split("T")[0];

      const analytics = historyMap.get(date);

      chartData.push({
        date,
        visits: analytics ? analytics.visits : 0,
        registrations: analytics ? analytics.registrations : 0,
        logins: analytics ? analytics.logins : 0,
        tasks: taskMap.get(date) || 0
      });

    }

    res.status(200).json(chartData);

  } catch (error) {

    res.status(500).json({
      message: "Admin charts error",
      error: error.message,
    });

  }
};

/* ===============================
   TRACK VISIT (1 PER IP / DAY)
================================ */
exports.trackVisit = async (req, res) => {

  try {

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    await analyticsService.incrementVisit(ip);

    res.status(200).json({ success: true });

  } catch (error) {

    res.status(500).json({
      message: "Visit tracking error",
    });

  }
};