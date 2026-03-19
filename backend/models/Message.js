const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* Index for fast message loading in conversations */
messageSchema.index({ conversation: 1, createdAt: -1 });

/* Index for unread message checks */
messageSchema.index({ conversation: 1, isRead: 1 });

module.exports = mongoose.model("Message", messageSchema);
