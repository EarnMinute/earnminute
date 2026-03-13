const Escrow = require("../models/Escrow");

/* ===============================
   CREATE ESCROW
================================ */

const createEscrow = async (data) => {
  return await Escrow.create(data);
};

/* ===============================
   FIND BY TASK
================================ */

const findByTaskId = async (taskId) => {
  return await Escrow.findOne({ task: taskId });
};

/* ===============================
   UPDATE ESCROW STATUS
================================ */

const updateEscrowStatus = async (escrowId, status, extra = {}) => {
  return await Escrow.findByIdAndUpdate(
    escrowId,
    {
      status,
      ...extra
    },
    { new: true }
  );
};

module.exports = {
  createEscrow,
  findByTaskId,
  updateEscrowStatus
};