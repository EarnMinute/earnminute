const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: [
      "application_received",
      "task_assigned",
      "task_completed",
      "rating_received",
      "user_registered",
      "task_created"
    ],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  link: {
    type: String,
  },

  isRead: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });


/* ===============================
   INDEXES
================================ */

/* User notifications */
notificationSchema.index({ user: 1, createdAt: -1 });

/* Unread lookup */
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);