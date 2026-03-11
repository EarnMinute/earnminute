const Notification = require("../models/Notification");

/* ===============================
CREATE NOTIFICATION
================================ */
const createNotification = async (data) => {
return Notification.create(data);
};

/* ===============================
GET USER NOTIFICATIONS (LEGACY)
================================ */
const getUserNotifications = async (userId, limit = 20) => {
return Notification.find({ user: userId })
.sort({ createdAt: -1 })
.limit(limit);
};

/* ===============================
GET USER NOTIFICATIONS PAGINATED
================================ */
const getUserNotificationsPaginated = async (userId, skip, limit) => {
return Notification.find({ user: userId })
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit);
};

/* ===============================
COUNT TOTAL NOTIFICATIONS
================================ */
const countNotifications = async (userId) => {
return Notification.countDocuments({ user: userId });
};

/* ===============================
COUNT UNREAD NOTIFICATIONS
================================ */
const countUnreadNotifications = async (userId) => {
return Notification.countDocuments({
user: userId,
isRead: false,
});
};

/* ===============================
MARK SINGLE NOTIFICATION READ
================================ */
const markNotificationRead = async (notificationId, userId) => {
return Notification.findOneAndUpdate(
{ _id: notificationId, user: userId },
{ isRead: true },
{ new: true }
);
};

/* ===============================
MARK ALL NOTIFICATIONS READ
================================ */
const markAllNotificationsRead = async (userId) => {
return Notification.updateMany(
{ user: userId, isRead: false },
{ isRead: true }
);
};

module.exports = {
createNotification,
getUserNotifications,
getUserNotificationsPaginated,
countNotifications,
countUnreadNotifications,
markNotificationRead,
markAllNotificationsRead,
};
