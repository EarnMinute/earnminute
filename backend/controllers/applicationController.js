const Application = require("../models/Application");
const Task = require("../models/Task");
const User = require("../models/User");

exports.applyToTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task || task.status !== "open") {
      return res.status(400).json({ message: "Task not available" });
    }

    const application = await Application.create({
      task: task._id,
      freelancer: req.user._id,
    });
 

    task.applicationsCount += 1;
    await task.save();

    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForTask = async (req, res) => {
  try {
    const applications = await Application.find({
      task: req.params.taskId,
      status: "applied",
    }).populate("freelancer", "name ratingAverage whatsapp");

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignFreelancer = async (req, res) => {
  try {
    const { taskId, applicationId } = req.params;

    const task = await Task.findById(taskId);
    if (!task || task.status !== "open") {
      return res.status(400).json({ message: "Task already assigned" });
    }

    const selectedApplication = await Application.findById(applicationId);

    task.status = "assigned";
    task.assignedFreelancer = selectedApplication.freelancer;
    await task.save();

    selectedApplication.status = "assigned";
    await selectedApplication.save();

    await Application.updateMany(
      { task: taskId, _id: { $ne: applicationId } },
      { status: "rejected" }
    );

    res.status(200).json({ message: "Freelancer assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFreelancerDashboard = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    // Get freelancer info
    const freelancer = await User.findById(freelancerId);

    const applications = await Application.find({
      freelancer: freelancerId,
      isDeleted: { $ne: true },
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
      // 🔥 Skip if task no longer exists
      if (!app.task) return;

      if (app.status === "rejected") {
        rejected.push(app);
      } 
      else if (app.status === "assigned" && app.task?.status === "completed") {
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
      freelancer: {
        name: freelancer?.name || "",
        ratingAverage: freelancer?.ratingAverage || 0,
        ratingCount: freelancer?.ratingCount || 0,
      },
      applied,
      assigned,
      completed,
      rejected,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};