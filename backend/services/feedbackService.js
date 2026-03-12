const feedbackRepository = require("../repositories/feedbackRepository");

exports.submitFeedback = async (data) => {
  return feedbackRepository.createFeedback(data);
};

exports.getFeedbacks = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;

  return feedbackRepository.getFeedbacks({
    page,
    limit,
    status: query.status,
    type: query.type,
  });
};

exports.markReviewed = async (id) => {
  return feedbackRepository.updateFeedbackStatus(id, "reviewed");
};