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
GET USER NOTIFICATIONS (PAGINATED)
================================ */
const getNotifications = async (userId, page = 1) => {

const limit = 10;
const skip = (page - 1) * limit;

const notifications =
await notificationRepository.getUserNotificationsPaginated(
userId,
skip,
limit
);

const totalNotifications =
await notificationRepository.countNotifications(userId);

const unreadCount =
await notificationRepository.countUnreadNotifications(userId);

return {
page,
totalPages: Math.ceil(totalNotifications / limit),
totalNotifications,
unreadCount,
notifications,
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