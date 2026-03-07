const Application = require("../models/Application");

class ApplicationRepository {

  async createApplication(data) {
    return await Application.create(data);
  }

  async findByTask(taskId) {
    return await Application.find({ task: taskId }).populate("freelancer", "name email");
  }

  async findByFreelancer(freelancerId) {
    return await Application.find({ freelancer: freelancerId }).populate("task");
  }

  async findById(id) {
    return await Application.findById(id);
  }

  async updateById(id, updateData) {
    return await Application.findByIdAndUpdate(id, updateData, { new: true });
  }

}

module.exports = new ApplicationRepository();