const notificationService = require("../services/notificationService");

/* ===============================
GET USER NOTIFICATIONS (PAGINATED)
================================ */
const getNotifications = async (req, res) => {
try {

const userId = req.user._id;
const page = req.query.page ? Number(req.query.page) : 1;

const data = await notificationService.getNotifications(userId, page);

res.json({
  success: true,
  page: data.page,
  totalPages: data.totalPages,
  totalNotifications: data.totalNotifications,
  unreadCount: data.unreadCount,
  notifications: data.notifications,
});

} catch (error) {

console.error("Notifications fetch error:", error);

res.status(500).json({
  success: false,
  message: "Failed to fetch notifications",
});

}
};

/* ===============================
GET UNREAD COUNT
================================ */
const getUnreadCount = async (req, res) => {
try {

const userId = req.user._id;

const count = await notificationService.getUnreadCount(userId);

res.json({
  success: true,
  unreadCount: count,
});

} catch (error) {

console.error("Unread count error:", error);

res.status(500).json({
  success: false,
  message: "Failed to fetch unread count",
});

}
};

/* ===============================
MARK SINGLE NOTIFICATION READ
================================ */
const markNotificationRead = async (req, res) => {
try {

const userId = req.user._id;
const notificationId = req.params.id;

const notification = await notificationService.markNotificationRead(
  notificationId,
  userId
);

res.json({
  success: true,
  notification,
});

} catch (error) {

console.error("Mark notification read error:", error);

res.status(500).json({
  success: false,
  message: "Failed to mark notification as read",
});

}
};

/* ===============================
MARK ALL NOTIFICATIONS READ
================================ */
const markAllNotificationsRead = async (req, res) => {
try {

const userId = req.user._id;

await notificationService.markAllNotificationsRead(userId);

res.json({
  success: true,
  message: "All notifications marked as read",
});

} catch (error) {

console.error("Mark all notifications read error:", error);

res.status(500).json({
  success: false,
  message: "Failed to mark all notifications as read",
});

}
};

module.exports = {
getNotifications,
getUnreadCount,
markNotificationRead,
markAllNotificationsRead,
};
