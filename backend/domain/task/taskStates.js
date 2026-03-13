const TASK_STATES = Object.freeze({
  DRAFT: "draft",
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  REVISION_REQUESTED: "revision_requested",
  APPROVED: "approved",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed"
});

module.exports = TASK_STATES;