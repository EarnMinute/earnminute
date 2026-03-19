const express = require("express");
const router = express.Router();
const { markEscrowFunded } = require("../controllers/escrowController");

// TODO: add admin auth middleware here
router.patch("/:taskId/fund", markEscrowFunded);

module.exports = router;
