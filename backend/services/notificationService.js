const notificationRepository = require("../repositories/notificationRepository");

/* ===============================
   CREATE NOTIFICATION
================================ */
const createNotification = async ({ user, type, message, link }) => {
  return notificationRepository.createNotification({
    user,
    type,
    message,
    link,
  });
};

/* ===============================
   GET USER NOTIFICATIONS
================================ */
const getNotifications = async (userId) => {
  const notifications = await notificationRepository.getUserNotifications(userId);
  const unreadCount = await notificationRepository.countUnreadNotifications(userId);

  return {
    notifications,
    unreadCount,
  };
};

/* ===============================
   MARK SINGLE NOTIFICATION READ
================================ */
const markNotificationRead = async (notificationId, userId) => {
  return notificationRepository.markNotificationRead(notificationId, userId);
};

/* ===============================
   MARK ALL NOTIFICATIONS READ
================================ */
const markAllNotificationsRead = async (userId) => {
  return notificationRepository.markAllNotificationsRead(userId);
};

/* ===============================
   GET UNREAD COUNT
================================ */
const getUnreadCount = async (userId) => {
  return notificationRepository.countUnreadNotifications(userId);
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
};