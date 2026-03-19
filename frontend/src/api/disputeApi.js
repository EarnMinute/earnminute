import API from "@/services/api";

/* ===============================
   RAISE DISPUTE
================================ */
export const raiseDispute = async (data) => {
  const res = await API.post("/disputes", data);
  return res.data.data;
};

/* ===============================
   GET DISPUTE BY TASK
================================ */
export const getDisputeByTask = async (taskId) => {
  const res = await API.get(`/disputes/task/${taskId}`);
  return res.data.data;
};

/* ===============================
   ADMIN: GET ALL DISPUTES
================================ */
export const getAllDisputes = async (params) => {
  const res = await API.get("/disputes", { params });
  return res.data;
};

/* ===============================
   ADMIN: RESOLVE DISPUTE
================================ */
export const resolveDispute = async (data) => {
  const res = await API.post("/disputes/resolve", data);
  return res.data.data;
};
