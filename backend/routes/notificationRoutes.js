const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

/* ===============================
   GET USER NOTIFICATIONS
================================ */
router.get("/", protect, getNotifications);

/* ===============================
   GET UNREAD COUNT
================================ */
router.get("/unread-count", protect, getUnreadCount);

/* ===============================
   MARK SINGLE NOTIFICATION READ
================================ */
router.patch("/:id/read", protect, markNotificationRead);

/* ===============================
   MARK ALL NOTIFICATIONS READ
================================ */
router.patch("/read-all", protect, markAllNotificationsRead);

module.exports = router;