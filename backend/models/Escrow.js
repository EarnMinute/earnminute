const mongoose = require("mongoose");

const escrowSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "funded",
        "released",
        "refunded",
        "disputed"
      ],
      default: "pending"
    },

    paymentGateway: {
      type: String,
      default: null
    },

    paymentTransactionId: {
      type: String,
      default: null
    },

    fundedAt: {
      type: Date
    },

    releasedAt: {
      type: Date
    },

    refundedAt: {
      type: Date
    }

  },
  { timestamps: true }
);

/* ===============================
   INDEXES
================================ */

escrowSchema.index({ task: 1 });
escrowSchema.index({ employer: 1 });
escrowSchema.index({ freelancer: 1 });

module.exports = mongoose.model("Escrow", escrowSchema);