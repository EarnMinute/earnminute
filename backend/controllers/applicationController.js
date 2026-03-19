const Application = require("../models/Application");
const Task = require("../models/Task");
const User = require("../models/User");
const applicationService = require("../services/applicationService");
const Escrow = require("../models/Escrow");

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

    /* ===============================
   ATTACH ESCROW STATUS
================================= */

    const taskIds = applications.map((app) => app.task?._id).filter(Boolean);

    const escrows = await Escrow.find({
      task: { $in: taskIds },
    });

    const escrowMap = {};
    escrows.forEach((e) => {
      escrowMap[e.task.toString()] = e;
    });

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

      const taskId = app.task._id.toString();

      app.task = {
        ...app.task.toObject(),
        escrowStatus: escrowMap[taskId]?.status || "none",
      };

      const taskStatus = app.task.status;

      /* ===============================
     TASK STATUS ALWAYS FIRST
  ================================ */

      if (taskStatus === "assigned") {
        assigned.push(app);
        return;
      }

      if (taskStatus === "in_progress") {
        in_progress.push(app);
        return;
      }

      if (taskStatus === "submitted") {
        submitted.push(app);
        return;
      }

      if (taskStatus === "revision_requested") {
        revision_requested.push(app);
        return;
      }

      if (taskStatus === "approved") {
        approved.push(app);
        return;
      }

      if (taskStatus === "completed") {
        completed.push(app);
        return;
      }

      if (taskStatus === "cancelled") {
        cancelled.push(app);
        return;
      }

      if (taskStatus === "disputed") {
        disputed.push(app);
        return;
      }

      /* ===============================
     FALLBACK TO APPLICATION STATUS
  ================================ */

      if (app.status === "rejected") {
        rejected.push(app);
        return;
      }

      if (app.status === "applied") {
        applied.push(app);
        return;
      }

      /* fallback */
      applied.push(app);
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
