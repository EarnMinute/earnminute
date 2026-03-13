/*
==================================================
TASK LIFECYCLE STATES
Central source of truth for frontend
==================================================
*/

export const TASK_STATES = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  REVISION_REQUESTED: "revision_requested",
  APPROVED: "approved",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
};

/*
==================================================
STATE LABELS (UI Friendly)
==================================================
*/

export const TASK_STATE_LABELS = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  submitted: "Submitted",
  revision_requested: "Revision Requested",
  approved: "Approved",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

/*
==================================================
STATUS BADGE COLORS
Used for UI indicators
==================================================
*/

export const TASK_STATE_COLORS = {
  open: "bg-gray-200 text-gray-700",

  assigned: "bg-blue-100 text-blue-800",

  in_progress: "bg-blue-200 text-blue-900",

  submitted: "bg-yellow-100 text-yellow-800",

  revision_requested: "bg-orange-100 text-orange-800",

  approved: "bg-green-100 text-green-800",

  completed: "bg-green-200 text-green-900",

  cancelled: "bg-gray-300 text-gray-700",

  disputed: "bg-red-100 text-red-700",
};

/*
==================================================
EMPLOYER DASHBOARD MENU
==================================================
*/

export const EMPLOYER_DASHBOARD_TABS = [
  { key: "open", label: "Open Tasks" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "submitted", label: "Submitted" },
  { key: "revision_requested", label: "Revision Requested" },
  { key: "approved", label: "Approved" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "disputed", label: "Disputed" },
];

/*
==================================================
FREELANCER DASHBOARD MENU
==================================================
*/

export const FREELANCER_DASHBOARD_TABS = [
  { key: "applied", label: "Applied" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "submitted", label: "Submitted" },
  { key: "revision_requested", label: "Revision Requested" },
  { key: "approved", label: "Approved" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "disputed", label: "Disputed" },
  { key: "rejected", label: "Rejected" },
];

/*
==================================================
HELPER FUNCTIONS
==================================================
*/

export function getTaskStatusLabel(status) {
  return TASK_STATE_LABELS[status] || status;
}

export function getTaskStatusColor(status) {
  return TASK_STATE_COLORS[status] || "bg-gray-200 text-gray-700";
}
