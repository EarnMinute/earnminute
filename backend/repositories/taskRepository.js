const Task = require("../models/Task");

class TaskRepository {

  async createTask(taskData) {
    return await Task.create(taskData);
  }

  async findById(taskId) {
    return await Task.findById(taskId);
  }

  async findAll(filter = {}) {
    return await Task.find(filter);
  }

  async updateById(taskId, updateData) {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
  }

  async deleteById(taskId) {
    return await Task.findByIdAndDelete(taskId);
  }

  async incrementApplications(taskId) {
    return await Task.findByIdAndUpdate(
      taskId,
      { $inc: { applicationsCount: 1 } },
      { new: true }
    );
  }

}

module.exports = new TaskRepository();