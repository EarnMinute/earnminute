const Application = require("../models/Application");

/* ===============================
   FIND APPLICATION BY TASK + FREELANCER
================================ */
const findByTaskAndFreelancer = async (taskId, freelancerId) => {
  return Application.findOne({
    task: taskId,
    freelancer: freelancerId,
  });
};

/* ===============================
   CREATE APPLICATION
================================ */
const createApplication = async (data) => {
  return Application.create(data);
};

/* ===============================
   FIND APPLICATION BY ID
================================ */
const findById = async (id) => {
  return Application.findById(id);
};

/* ===============================
   UPDATE APPLICATION
================================ */
const saveApplication = async (application) => {
  return application.save();
};

/* ===============================
   REJECT OTHER APPLICATIONS
================================ */
const rejectOtherApplications = async (taskId, selectedId) => {
  return Application.updateMany(
    { task: taskId, _id: { $ne: selectedId } },
    { status: "rejected" },
  );
};

module.exports = {
  findByTaskAndFreelancer,
  createApplication,
  findById,
  saveApplication,
  rejectOtherApplications,
};
