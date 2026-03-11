const Conversation = require("../models/Conversation");

exports.findConversationByTaskAndFreelancer = async (taskId, freelancerId) => {
return Conversation.findOne({
task: taskId,
freelancer: freelancerId
});
};

exports.createConversation = async (data) => {
return Conversation.create(data);
};

exports.getUserConversations = async (userId, page = 1, limit = 20) => {

const skip = (page - 1) * limit;

return Conversation.find({
$or: [{ employer: userId }, { freelancer: userId }]
})
.populate("task", "title")
.populate("employer", "name")
.populate("freelancer", "name")
.sort({ lastMessageAt: -1 })
.skip(skip)
.limit(limit);

};

exports.findConversationById = async (conversationId) => {
return Conversation.findById(conversationId)
.populate("task", "title")
.populate("employer", "name")
.populate("freelancer", "name");
};

exports.updateLastMessage = async (conversationId, message) => {
return Conversation.findByIdAndUpdate(
conversationId,
{
lastMessage: message,
lastMessageAt: new Date()
},
{ new: true }
);
};