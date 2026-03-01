const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  budgetType: { type: String, enum: ["fixed", "negotiable"], required: true },
  budgetAmount: { type: Number, required: true },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ["open", "assigned", "completed"],
    default: "open",
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
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicationsCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
