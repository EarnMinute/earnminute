const taskRepository = require("../repositories/taskRepository");
const ApiError = require("../utils/ApiError");

class TaskService {

  async createTask(taskData, employerId) {

    const task = await taskRepository.createTask({
      ...taskData,
      employer: employerId
    });

    return task;
  }

  async getAllTasks() {

    return await taskRepository.findAll({
      isDeleted: false
    });

  }

  async getTaskById(taskId) {

    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return task;
  }

  async deleteTask(taskId) {

    const task = await taskRepository.deleteById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return task;
  }

}

module.exports = new TaskService();