const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedbackController");
const { protect, authorize } = require("../middleware/authMiddleware");

/* ===============================
PUBLIC SUBMIT
================================ */
router.post("/", feedbackController.submitFeedback);

/* ===============================
ADMIN: GET FEEDBACK LIST
================================ */
router.get(
  "/",
  protect,
  authorize("admin"),
  feedbackController.getFeedbacks
);

/* ===============================
ADMIN: MARK REVIEWED
================================ */
router.patch(
  "/:id/review",
  protect,
  authorize("admin"),
  feedbackController.markReviewed
);

module.exports = router;