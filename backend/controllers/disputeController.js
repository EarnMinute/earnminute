const disputeService = require("../services/disputeService");

/* ===============================
   RAISE DISPUTE
================================ */
const raiseDispute = async (req, res) => {
  try {
    const { taskId, reason, description } = req.body;

    const dispute = await disputeService.raiseDispute({
      taskId,
      userId: req.user.id,
      reason,
      description,
    });

    res.status(201).json({
      success: true,
      data: dispute,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===============================
   GET DISPUTE BY TASK
================================ */
const getDisputeByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const dispute = await disputeService.getDisputeByTask(taskId);

    res.json({
      success: true,
      data: dispute,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===============================
   ADMIN: GET ALL DISPUTES
================================ */
const getAllDisputes = async (req, res) => {
  try {
    const { page, status } = req.query;

    const data =
      await require("../repositories/disputeRepository").getAllDisputes({
        page,
        status,
      });

    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===============================
   ADMIN: RESOLVE DISPUTE
================================ */
const resolveDispute = async (req, res) => {
  try {
    const { disputeId, resolution } = req.body;

    const result = await disputeService.resolveDispute({
      disputeId,
      adminId: req.user.id,
      resolution,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  raiseDispute,
  getDisputeByTask,
  getAllDisputes,
  resolveDispute,
};
