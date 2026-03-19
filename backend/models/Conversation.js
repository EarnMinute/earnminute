const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastMessage: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

/* Prevent duplicate conversation for same task + freelancer */
conversationSchema.index({ task: 1, freelancer: 1 }, { unique: true });

/* Faster conversation queries */
conversationSchema.index({ employer: 1, lastMessageAt: -1 });
conversationSchema.index({ freelancer: 1, lastMessageAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
