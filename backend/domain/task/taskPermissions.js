const TASK_STATES = require("./taskStates");

const TASK_PERMISSIONS = {

  [TASK_STATES.ASSIGNED]: ["employer"],
  [TASK_STATES.IN_PROGRESS]: ["freelancer"],
  [TASK_STATES.SUBMITTED]: ["freelancer"],
  [TASK_STATES.REVISION_REQUESTED]: ["employer"],
  [TASK_STATES.APPROVED]: ["employer"]

};

module.exports = TASK_PERMISSIONS;