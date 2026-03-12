const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "suggestion",
        "bug",
        "ui",
        "performance",
        "general"
      ],
      default: "general",
      index: true,
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
      index: true,
    },

    status: {
      type: String,
      enum: ["new", "reviewed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

/* ===============================
   INDEXES
================================ */

feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);