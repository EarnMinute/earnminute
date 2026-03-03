const Task = require("../models/Task");
const User = require("../models/User");

/* ===============================
   CREATE TASK
================================= */
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      employer: req.user._id,
      status: "open",
      isDeleted: false,
      isRated: false,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL PUBLIC TASKS
================================= */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "open",
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   EMPLOYER DASHBOARD
================================= */
exports.getEmployerDashboard = async (req, res) => {
  try {
    const employerId = req.user._id;

    const tasks = await Task.find({
      employer: employerId,
      isDeleted: { $ne: true },
    })
      .populate("assignedFreelancer", "name rating")
      .sort({ createdAt: -1 });

    const open = [];
    const assigned = [];
    const completed = [];

    tasks.forEach((task) => {
      if (task.status === "open") open.push(task);
      else if (task.status === "assigned") assigned.push(task);
      else if (task.status === "completed") completed.push(task);
    });

    res.status(200).json({ open, assigned, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   COMPLETE TASK
================================= */
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    if (task.status !== "assigned")
      return res.status(400).json({
        message: "Task must be assigned before completing",
      });

    task.status = "completed";
    task.isRated = false;

    await task.save();

    res.status(200).json({
      message: "Task marked as completed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   RATE FREELANCER
================================= */
exports.rateFreelancer = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const taskId = req.params.taskId;
    const employerId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const task = await Task.findById(taskId);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    if (task.employer.toString() !== employerId.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (task.status !== "completed")
      return res.status(400).json({
        message: "Task must be completed before rating",
      });

    if (task.isRated)
      return res.status(400).json({
        message: "Task already rated",
      });

    const freelancer = await User.findById(
      task.assignedFreelancer
    );

    if (!freelancer)
      return res.status(404).json({
        message: "Freelancer not found",
      });

    // 🔥 Update structured rating
    freelancer.rating.total += rating;
    freelancer.rating.count += 1;
    freelancer.rating.average =
      freelancer.rating.total / freelancer.rating.count;

    await freelancer.save();

    // Save rating inside task
    task.isRated = true;
    task.rating = rating;
    task.review = review;

    await task.save();

    res.status(200).json({
      message: "Rating submitted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};