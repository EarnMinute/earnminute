const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "user_joined",
        "task_posted",
        "task_applied",
        "task_completed"
      ],
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    userName: {
      type: String,
      required: true
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null
    },

    taskTitle: {
      type: String,
      default: null
    }

  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);