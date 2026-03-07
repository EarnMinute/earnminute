const applicationRepository = require("../repositories/applicationRepository");
const taskRepository = require("../repositories/taskRepository");
const ApiError = require("../utils/ApiError");

class ApplicationService {

  async applyToTask(taskId, freelancerId) {

    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const application = await applicationRepository.createApplication({
      task: taskId,
      freelancer: freelancerId
    });

    await taskRepository.incrementApplications(taskId);

    return application;

  }

  async getApplicationsForTask(taskId) {
    return await applicationRepository.findByTask(taskId);
  }

  async getFreelancerApplications(freelancerId) {
    return await applicationRepository.findByFreelancer(freelancerId);
  }

}

module.exports = new ApplicationService();