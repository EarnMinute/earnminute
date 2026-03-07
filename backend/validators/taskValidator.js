const ApiError = require("../utils/ApiError");

exports.validateCreateTask = (req, res, next) => {
  const { title, description, budgetAmount } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description required");
  }

  if (budgetAmount && budgetAmount < 0) {
    throw new ApiError(400, "Budget must be positive");
  }

  next();
};