const analyticsRepository = require("../repositories/analyticsRepository");

class AnalyticsService {

  async getAdminDashboardStats() {

    const totalUsers = await analyticsRepository.getTotalUsers();
    const totalTasks = await analyticsRepository.getTotalTasks();
    const totalApplications = await analyticsRepository.getTotalApplications();
    const activeTasks = await analyticsRepository.getActiveTasks();

    return {
      totalUsers,
      totalTasks,
      totalApplications,
      activeTasks
    };

  }

}

module.exports = new AnalyticsService();