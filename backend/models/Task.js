const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    skills: [String],

    budgetType: {
      type: String,
      enum: ["fixed", "negotiable"],
      required: true,
    },

    budgetAmount: { type: Number, required: true },

    deadline: { type: Date },

    status: {
      type: String,
      enum: [
        "draft",
        "open",
        "assigned",
        "in_progress",
        "submitted",
        "revision_requested",
        "approved",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "open",
    },

    submittedAt: {
      type: Date,
    },

    approvedAt: {
      type: Date,
    },

    isRated: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ===============================
   INDEXES
================================ */

/* Browse tasks */
taskSchema.index({ status: 1, isDeleted: 1, createdAt: -1 });

/* Employer dashboard */
taskSchema.index({ employer: 1, createdAt: -1 });

/* Assigned freelancer lookup */
taskSchema.index({ assignedFreelancer: 1 });

/* Admin moderation sorting */
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);