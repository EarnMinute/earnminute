const express = require("express");
const router = express.Router();

const {
  getLiveActivities
} = require("../controllers/activityController");

/* ===============================
   PUBLIC FEED
================================ */

router.get("/", getLiveActivities);

module.exports = router;