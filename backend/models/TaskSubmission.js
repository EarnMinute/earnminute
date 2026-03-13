const mongoose = require("mongoose");

const taskSubmissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String
    },

    links: [
      {
        type: String
      }
    ],

    files: [
      {
        type: String
      }
    ],

    screenshots: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

/* ===============================
   INDEXES
================================ */

taskSubmissionSchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model("TaskSubmission", taskSubmissionSchema);