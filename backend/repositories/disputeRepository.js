const Dispute = require("../models/Dispute");

/* ===============================
   CREATE DISPUTE
================================ */
const createDispute = async (data) => {
  return await Dispute.create(data);
};

/* ===============================
   FIND BY TASK
================================ */
const findByTaskId = async (taskId) => {
  return await Dispute.findOne({ task: taskId })
    .populate("raisedBy", "name role")
    .populate("resolvedBy", "name role");
};

/* ===============================
   GET ALL DISPUTES (ADMIN)
================================ */
const getAllDisputes = async ({ page = 1, limit = 20, status }) => {
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const disputes = await Dispute.find(query)
    .populate("task")
    .populate("raisedBy", "name role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Dispute.countDocuments(query);

  return {
    disputes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/* ===============================
   RESOLVE DISPUTE
================================ */
const resolveDispute = async (id, data) => {
  return await Dispute.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createDispute,
  findByTaskId,
  getAllDisputes,
  resolveDispute,
};
