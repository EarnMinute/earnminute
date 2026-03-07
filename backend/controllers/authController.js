const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");


exports.register = asyncHandler(async (req, res) => {

  const result = await authService.register(req.body);

  res.status(201).json(
    new ApiResponse(201, result, "User registered successfully")
  );

});


exports.login = asyncHandler(async (req, res) => {

  const result = await authService.login(
    req.body.email,
    req.body.password
  );

  res.status(200).json(
    new ApiResponse(200, result, "Login successful")
  );

});