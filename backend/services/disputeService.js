const disputeRepository = require("../repositories/disputeRepository");
const taskRepository = require("../repositories/taskRepository");
const escrowRepository = require("../repositories/escrowRepository");
const activityService = require("./activityService");

/* ===============================
   RAISE DISPUTE
================================ */
const raiseDispute = async ({ taskId, userId, reason, description }) => {
  // 1. Check task exists
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // 2. Validate user is part of task
  const isParticipant =
    task.employer.toString() === userId ||
    task.assignedFreelancer?.toString() === userId;

  if (!isParticipant) {
    throw new Error("Not authorized to dispute this task");
  }

  // 3. Validate task state
  const allowedStates = ["submitted", "revision_requested"];

  if (!allowedStates.includes(task.status)) {
    throw new Error("Dispute not allowed at this stage");
  }

  // 4. Prevent duplicate dispute
  const existing = await disputeRepository.findByTaskId(taskId);

  if (existing) {
    throw new Error("Dispute already exists for this task");
  }

  // 5. Get escrow
  const escrow = await escrowRepository.findByTaskId(taskId);

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  // 6. LOCK ESCROW
  await escrowRepository.updateEscrowStatus(escrow._id, "disputed", {});

  // 7. UPDATE TASK STATUS → disputed
  await taskRepository.updateTask(taskId, {
    status: "disputed",
  });

  // 8. CREATE DISPUTE
  const dispute = await disputeRepository.createDispute({
    task: taskId,
    raisedBy: userId,
    reason,
    description,
  });

  // 9. TIMELINE LOG
  await activityService.logTaskActivity(taskId, "task_disputed", userId);

  return dispute;
};

/* ===============================
   GET DISPUTE BY TASK
================================ */
const getDisputeByTask = async (taskId) => {
  return disputeRepository.findByTaskId(taskId);
};

/* ===============================
   ADMIN: RESOLVE DISPUTE
================================ */
const resolveDispute = async ({ disputeId, adminId, resolution }) => {
  const dispute = await require("../models/Dispute").findById(disputeId);

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  if (dispute.status === "resolved") {
    throw new Error("Dispute already resolved");
  }

  const taskId = dispute.task;

  const escrow = await escrowRepository.findByTaskId(taskId);

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  // 1. RESOLUTION LOGIC
  if (resolution === "pay_freelancer") {
    await escrowRepository.updateEscrowStatus(escrow._id, "released", {
      releasedAt: new Date(),
    });
  } else if (resolution === "refund_employer") {
    await escrowRepository.updateEscrowStatus(escrow._id, "refunded", {
      refundedAt: new Date(),
    });
  } else {
    throw new Error("Invalid resolution type");
  }

  // 2. UPDATE TASK → completed
  await taskRepository.updateTask(taskId, {
    status: "completed",
  });

  // 3. UPDATE DISPUTE
  const updated = await disputeRepository.resolveDispute(dispute._id, {
    status: "resolved",
    resolution,
    resolvedBy: adminId,
    resolvedAt: new Date(),
  });

  // 4. TIMELINE LOG
  await activityService.logTaskActivity(taskId, "task_completed", adminId);

  return updated;
};

module.exports = {
  raiseDispute,
  getDisputeByTask,
  resolveDispute,
};
