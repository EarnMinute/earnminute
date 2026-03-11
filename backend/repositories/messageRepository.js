const Message = require("../models/Message");

exports.createMessage = async (data) => {
return Message.create(data);
};

exports.getMessagesByConversation = async (conversationId, limit = 30, skip = 0) => {
return Message.find({ conversation: conversationId })
.populate("sender", "name role")
.sort({ createdAt: -1 })
.limit(limit)
.skip(skip);
};

exports.markMessagesAsRead = async (conversationId, userId) => {
return Message.updateMany(
{
conversation: conversationId,
sender: { $ne: userId },
isRead: false
},
{
$set: { isRead: true }
}
);
};

exports.countUnreadMessages = async (conversationId, userId) => {
return Message.countDocuments({
conversation: conversationId,
sender: { $ne: userId },
isRead: false
});
};