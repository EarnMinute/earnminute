const express = require("express");
const router = express.Router();

const {
  raiseDispute,
  getDisputeByTask,
  getAllDisputes,
  resolveDispute,
} = require("../controllers/disputeController");

// ✅ Correct imports
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

/* ===============================
   USER ROUTES
================================ */

router.post("/", protect, raiseDispute);

router.get("/task/:taskId", protect, getDisputeByTask);

/* ===============================
   ADMIN ROUTES
================================ */

router.get("/", protect, restrictTo("admin"), getAllDisputes);

router.post("/resolve", protect, restrictTo("admin"), resolveDispute);

module.exports = router;
