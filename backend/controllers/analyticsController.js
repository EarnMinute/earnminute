const analyticsService = require("../services/analyticsService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

exports.getAdminDashboardStats = asyncHandler(async (req, res) => {

  const stats = await analyticsService.getAdminDashboardStats();

  res.status(200).json(
    new ApiResponse(200, stats)
  );

});