class TaskDTO {

  static sanitize(task) {

    return {
      id: task._id,
      title: task.title,
      description: task.description,
      budgetAmount: task.budgetAmount,
      status: task.status,
      createdAt: task.createdAt
    };

  }

}

module.exports = TaskDTO;