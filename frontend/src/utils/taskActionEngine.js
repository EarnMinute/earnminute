import {
  startTask,
  submitTask,
  requestRevision,
  approveSubmission,
  cancelTask,
  raiseDispute,
  completeTask,
} from "@/services/taskService";

/*
==================================================
TASK ACTION ENGINE
Determines which actions are allowed
==================================================
*/

export function getTaskActions(task, role) {
  const actions = [];

  const status = task.status;

  /* ===============================
     FREELANCER ACTIONS
  ================================ */

  if (role === "freelancer") {
    if (status === "assigned") {
      actions.push({
        label: "Start Task",
        action: () => startTask(task._id),
      });
    }

    if (status === "in_progress") {
      actions.push({
        label: "Submit Work",
        action: () => submitTask(task._id),
      });
    }

    if (status === "revision_requested") {
      actions.push({
        label: "Resubmit Work",
        action: () => submitTask(task._id),
      });
    }

    if (
      status === "assigned" ||
      status === "in_progress" ||
      status === "submitted"
    ) {
      actions.push({
        label: "Raise Dispute",
        action: () => raiseDispute(task._id),
      });
    }
  }

  /* ===============================
     EMPLOYER ACTIONS
  ================================ */

  if (role === "employer") {
    if (status === "submitted") {
      actions.push({
        label: "Approve Work",
        action: () => approveSubmission(task._id),
      });

      actions.push({
        label: "Request Revision",
        action: () => requestRevision(task._id),
      });
    }

    if (status === "approved") {
      actions.push({
        label: "Complete Task",
        action: () => completeTask(task._id),
      });
    }

    if (status === "open" || status === "assigned") {
      actions.push({
        label: "Cancel Task",
        action: () => cancelTask(task._id),
      });
    }
  }

  return actions;
}
