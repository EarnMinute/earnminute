const express = require("express");
const router = express.Router();

const {
  getPublicAnalytics,
} = require("../controllers/analyticsController");

router.get("/public", getPublicAnalytics);

module.exports = router;