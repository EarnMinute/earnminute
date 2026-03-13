const escrowRepository = require("../repositories/escrowRepository");
const taskRepository = require("../repositories/taskRepository");

/* ===============================
   CREATE ESCROW WHEN TASK ASSIGNED
================================ */

const createTaskEscrow = async (taskId, employerId, freelancerId, amount) => {

  const existing = await escrowRepository.findByTaskId(taskId);

  if (existing) {
    throw new Error("Escrow already exists for this task");
  }

  return await escrowRepository.createEscrow({
    task: taskId,
    employer: employerId,
    freelancer: freelancerId,
    amount
  });
};

/* ===============================
   MARK ESCROW FUNDED
================================ */

const markEscrowFunded = async (taskId, gateway, transactionId) => {

  const escrow = await escrowRepository.findByTaskId(taskId);

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  return await escrowRepository.updateEscrowStatus(
    escrow._id,
    "funded",
    {
      paymentGateway: gateway,
      paymentTransactionId: transactionId,
      fundedAt: new Date()
    }
  );
};

/* ===============================
   RELEASE ESCROW
================================ */

const releaseEscrow = async (taskId) => {

  const escrow = await escrowRepository.findByTaskId(taskId);

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  if (escrow.status !== "funded") {
    throw new Error("Escrow not funded");
  }

  return await escrowRepository.updateEscrowStatus(
    escrow._id,
    "released",
    {
      releasedAt: new Date()
    }
  );
};

module.exports = {
  createTaskEscrow,
  markEscrowFunded,
  releaseEscrow
};