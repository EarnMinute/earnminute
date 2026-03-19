const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["suggestion", "bug", "ui", "performance", "general"],
      default: "general",
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["new", "reviewed"],
      default: "new",
    },
  },
  { timestamps: true },
);

/* ===============================
   INDEXES
================================ */

// Filtering
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ user: 1 });
feedbackSchema.index({ status: 1 });

// Sorting
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
