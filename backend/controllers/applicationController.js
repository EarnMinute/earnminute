const applicationService = require("../services/applicationService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

exports.applyToTask = asyncHandler(async (req, res) => {

  const application = await applicationService.applyToTask(
    req.params.taskId,
    req.user.id
  );

  res.status(201).json(
    new ApiResponse(201, application, "Application submitted successfully")
  );

});


exports.getApplicationsForTask = asyncHandler(async (req, res) => {

  const applications = await applicationService.getApplicationsForTask(
    req.params.taskId
  );

  res.status(200).json(
    new ApiResponse(200, applications)
  );

});


exports.getMyApplications = asyncHandler(async (req, res) => {

  const applications = await applicationService.getFreelancerApplications(
    req.user.id
  );

  res.status(200).json(
    new ApiResponse(200, applications)
  );

});