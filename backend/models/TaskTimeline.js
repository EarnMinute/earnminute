const mongoose = require("mongoose");

const taskTimelineSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

/* ===============================
   INDEXES
================================ */

taskTimelineSchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model("TaskTimeline", taskTimelineSchema);
