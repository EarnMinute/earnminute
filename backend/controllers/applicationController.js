const Application = require("../models/Application");
const Task = require("../models/Task");
const User = require("../models/User");

/* ===============================
   APPLY TO TASK
================================= */
exports.applyToTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const freelancerId = req.user._id;

    const task = await Task.findById(taskId);

    if (!task || task.status !== "open") {
      return res.status(400).json({ message: "Task not available" });
    }

    // 🔐 Prevent duplicate application
    const existingApplication = await Application.findOne({
      task: taskId,
      freelancer: freelancerId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this task",
      });
    }

    const application = await Application.create({
      task: taskId,
      freelancer: freelancerId,
      status: "applied",
    });

    task.applicationsCount = (task.applicationsCount || 0) + 1;
    await task.save();

    res.status(201).json({
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const task = await Task.findById(taskId);

    if (!task || task.status !== "open") {
      return res.status(400).json({ message: "Task already assigned" });
    }

    const selectedApplication = await Application.findById(applicationId);

    if (!selectedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    task.status = "assigned";
    task.assignedFreelancer = selectedApplication.freelancer;
    await task.save();

    selectedApplication.status = "assigned";
    await selectedApplication.save();

    // Reject all others
    await Application.updateMany(
      { task: taskId, _id: { $ne: applicationId } },
      { status: "rejected" }
    );

    res.status(200).json({
      message: "Freelancer assigned successfully",
    });

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

    const freelancer = await User.findById(freelancerId).select(
      "name email rating"
    );

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
    const completed = [];
    const rejected = [];

    applications.forEach((app) => {
      if (!app.task) return;

      if (app.status === "rejected") {
        rejected.push(app);
      } 
      else if (app.status === "assigned" && app.task.status === "completed") {
        completed.push(app);
      }
      else if (app.status === "assigned") {
        assigned.push(app);
      } 
      else {
        applied.push(app);
      }
    });

    res.status(200).json({
      freelancer,
      applied,
      assigned,
      completed,
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