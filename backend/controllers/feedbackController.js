const feedbackService = require("../services/feedbackService");

exports.submitFeedback = async (req, res, next) => {
  try {
    const { type, message, name, email } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Feedback message is required",
      });
    }

    const feedback = await feedbackService.submitFeedback({
      type,
      message,
      name,
      email,
      user: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFeedbacks = async (req, res, next) => {
  try {
    const result = await feedbackService.getFeedbacks(req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

exports.markReviewed = async (req, res, next) => {
  try {
    const feedback = await feedbackService.markReviewed(req.params.id);

    res.json({
      success: true,
      feedback,
    });
  } catch (err) {
    next(err);
  }
};