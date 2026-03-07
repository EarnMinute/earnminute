const taskService = require("../services/taskService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

exports.createTask = asyncHandler(async (req, res) => {

  const task = await taskService.createTask(
    req.body,
    req.user.id
  );

  res.status(201).json(
    new ApiResponse(201, task, "Task created successfully")
  );

});


exports.getAllTasks = asyncHandler(async (req, res) => {

  const tasks = await taskService.getAllTasks();

  res.status(200).json(
    new ApiResponse(200, tasks)
  );

});


exports.getTaskById = asyncHandler(async (req, res) => {

  const task = await taskService.getTaskById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, task)
  );

});


exports.deleteTask = asyncHandler(async (req, res) => {

  await taskService.deleteTask(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Task deleted successfully")
  );

});