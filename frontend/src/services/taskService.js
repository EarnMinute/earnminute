import API from "./api";

/* ===============================
TASK ACTIONS
=============================== */

export const startTask = (taskId) => {
  return API.patch(`/tasks/${taskId}/start`);
};

export const submitTask = (taskId, data) => {
  return API.patch(`/tasks/${taskId}/submit`, data);
};

export const requestRevision = (taskId) => {
  return API.patch(`/tasks/${taskId}/revision`);
};

export const approveSubmission = (taskId) => {
  return API.patch(`/tasks/${taskId}/approve`);
};

export const completeTask = (taskId) => {
  return API.patch(`/tasks/${taskId}/complete`);
};

export const cancelTask = (taskId) => {
  return API.patch(`/tasks/${taskId}/cancel`);
};

export const raiseDispute = (taskId) => {
  return API.patch(`/tasks/${taskId}/dispute`);
};

/* ===============================
TASK DATA
=============================== */

export const getTask = (taskId) => {
  return API.get(`/tasks/${taskId}`);
};

export const getEmployerDashboard = () => {
  return API.get("/tasks/employer/dashboard");
};
