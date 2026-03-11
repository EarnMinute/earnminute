const chatService = require("../services/chatService");

exports.startConversation = async (req, res, next) => {
try {

const { taskId, freelancerId } = req.body;

const conversation = await chatService.startConversation(
taskId,
freelancerId
);

res.status(201).json({
success: true,
conversation
});

} catch (err) {
next(err);
}
};

exports.getUserConversations = async (req, res, next) => {
try {

const userId = req.user.id;

const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;

const conversations = await chatService.getUserConversations(
userId,
page,
limit
);

res.status(200).json({
success: true,
conversations
});

} catch (err) {
next(err);
}
};

exports.getMessages = async (req, res, next) => {
try {

const { conversationId } = req.params;
const page = parseInt(req.query.page) || 1;

const messages = await chatService.getMessages(conversationId, page);

res.status(200).json({
success: true,
messages
});

} catch (err) {
next(err);
}
};

exports.sendMessage = async (req, res, next) => {
try {

const { conversationId, content } = req.body;

const senderId = req.user.id;

const io = req.app.get("io");

const message = await chatService.sendMessage(
conversationId,
senderId,
content,
io
);

res.status(201).json({
success: true,
message,
delivery: "sent"
});

} catch (err) {
next(err);
}
};

exports.markConversationRead = async (req, res, next) => {
try {

const { conversationId } = req.params;

const userId = req.user.id;

await chatService.markConversationRead(conversationId, userId);

res.status(200).json({
success: true
});

} catch (err) {
next(err);
}
};