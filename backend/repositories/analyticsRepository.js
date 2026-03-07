const User = require("../models/User");
const Task = require("../models/Task");
const Application = require("../models/Application");

class AnalyticsRepository {

  async getTotalUsers() {
    return await User.countDocuments();
  }

  async getTotalTasks() {
    return await Task.countDocuments();
  }

  async getTotalApplications() {
    return await Application.countDocuments();
  }

  async getActiveTasks() {
    return await Task.countDocuments({ status: "open" });
  }

}

module.exports = new AnalyticsRepository();