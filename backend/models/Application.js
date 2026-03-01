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

module.exports = mongoose.model("Application", applicationSchema);
