const TASK_TRANSITIONS = require("./taskTransitions");

const validateTaskTransition = (currentState, nextState) => {

  const allowed = TASK_TRANSITIONS[currentState] || [];

  if (!allowed.includes(nextState)) {
    throw new Error(
      `Invalid task state transition: ${currentState} → ${nextState}`
    );
  }

};

module.exports = validateTaskTransition;