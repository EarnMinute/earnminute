const escrowService = require("../services/escrowService");

const markEscrowFunded = async (req, res) => {
  try {
    const { taskId } = req.params;

    // temporary manual funding (admin)
    const escrow = await escrowService.markEscrowFunded(
      taskId,
      "manual",
      "admin_marked",
    );

    res.json({
      success: true,
      message: "Escrow marked as funded",
      data: escrow,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  markEscrowFunded,
};
