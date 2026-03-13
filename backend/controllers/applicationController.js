const Application = require("../models/Application");
const Task = require("../models/Task");
const User = require("../models/User");
const applicationService = require("../services/applicationService");

/* ===============================
   APPLY TO TASK
================================= */
exports.applyToTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const freelancerId = req.user._id;

    const application = await applicationService.applyToTask(
      taskId,
      freelancerId,
    );

    res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   GET APPLICATIONS FOR TASK
================================= */
exports.getApplicationsForTask = async (req, res) => {
  try {
    const applications = await Application.find({
      task: req.params.taskId,
      status: "applied",
    }).populate("freelancer", "name rating");

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ASSIGN FREELANCER
================================= */
exports.assignFreelancer = async (req, res) => {
  try {
    const { taskId, applicationId } = req.params;
    const employerId = req.user._id;

    const result = await applicationService.assignFreelancer(
      taskId,
      applicationId,
      employerId,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   FREELANCER DASHBOARD
================================= */
exports.getFreelancerDashboard = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const freelancer =
      await User.findById(freelancerId).select("name email rating");

    const applications = await Application.find({
      freelancer: freelancerId,
    })
      .populate({
        path: "task",
        populate: {
          path: "employer",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    const applied = [];
    const assigned = [];
    const in_progress = [];
    const submitted = [];
    const revision_requested = [];
    const approved = [];
    const completed = [];
    const cancelled = [];
    const disputed = [];
    const rejected = [];

    applications.forEach((app) => {
      if (!app.task) return;

      if (app.status === "rejected") {
        rejected.push(app);
        return;
      }

      if (app.status === "applied") {
        applied.push(app);
        return;
      }

      if (app.status === "accepted") {
        const status = app.task.status;

        if (status === "assigned") assigned.push(app);
        else if (status === "in_progress") in_progress.push(app);
        else if (status === "submitted") submitted.push(app);
        else if (status === "revision_requested") revision_requested.push(app);
        else if (status === "approved") approved.push(app);
        else if (status === "completed") completed.push(app);
        else if (status === "cancelled") cancelled.push(app);
        else if (status === "disputed") disputed.push(app);
        else assigned.push(app);
      }
    });

    res.status(200).json({
      freelancer,
      applied,
      assigned,
      in_progress,
      submitted,
      revision_requested,
      approved,
      completed,
      cancelled,
      disputed,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN: GET ALL APPLICATIONS
================================= */
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("freelancer", "name email")
      .populate({
        path: "task",
        select: "title status budgetAmount",
        populate: {
          path: "employer",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};
