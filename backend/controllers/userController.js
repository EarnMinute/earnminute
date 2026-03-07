const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");


exports.getUserProfile = asyncHandler(async (req, res) => {

  const user = await userService.getUserById(req.user.id);

  res.status(200).json(
    new ApiResponse(200, user)
  );

});


exports.getAllUsers = asyncHandler(async (req, res) => {

  const users = await userService.getAllUsers();

  res.status(200).json(
    new ApiResponse(200, users)
  );

});


exports.updateUserRole = asyncHandler(async (req, res) => {

  const user = await userService.updateUserRole(
    req.params.id,
    req.body.role
  );

  res.status(200).json(
    new ApiResponse(200, user, "User role updated successfully")
  );

});


exports.deleteUser = asyncHandler(async (req, res) => {

  await userService.deleteUser(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );

});