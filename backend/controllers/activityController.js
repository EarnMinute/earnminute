const activityService = require("../services/activityService");

/* ===============================
   GET LIVE ACTIVITY
================================ */
exports.getLiveActivities = async (req, res) => {

  try {

    const activities = await activityService.getLiveFeed();

    res.json(activities);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch activities"
    });

  }

};