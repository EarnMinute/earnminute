const Feedback = require("../models/Feedback");

exports.createFeedback = async (data) => {
  return Feedback.create(data);
};

exports.getFeedbacks = async ({ page = 1, limit = 20, status, type }) => {
  const query = {};

  if (status) query.status = status;
  if (type) query.type = type;

  const skip = (page - 1) * limit;

  const feedbacks = await Feedback.find(query)
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Feedback.countDocuments(query);

  return {
    feedbacks,
    total,
  };
};

exports.updateFeedbackStatus = async (id, status) => {
  return Feedback.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};