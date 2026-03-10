const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ["applied", "assigned", "rejected"],
    default: "applied",
  },

}, { timestamps: true });

/* ===============================
   INDEXES
================================ */

/* Prevent duplicate applications */
applicationSchema.index({ task: 1, freelancer: 1 }, { unique: true });

/* Employer viewing applications */
applicationSchema.index({ task: 1 });

/* Freelancer dashboard */
applicationSchema.index({ freelancer: 1 });

module.exports = mongoose.model("Application", applicationSchema);