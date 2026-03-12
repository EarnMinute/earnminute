import { chatAPI } from "./api";
import { getSocket } from "./socket";

export const getConversations = async () => {
const res = await chatAPI.getConversations();
return res.data.conversations;
};

export const startConversation = async (taskId, freelancerId) => {
const res = await chatAPI.startConversation({
taskId,
freelancerId
});

return res.data.conversation;
};

export const getMessages = async (conversationId, page = 1) => {
const res = await chatAPI.getMessages(conversationId, page);
return res.data.messages;
};

export const sendMessage = async (conversationId, content) => {
const res = await chatAPI.sendMessage({
conversationId,
content
});

return res.data.message;
};

export const joinConversation = (conversationId) => {
const socket = getSocket();
if (socket) {
socket.emit("chat:join", conversationId);
}
};

export const leaveConversation = (conversationId) => {
const socket = getSocket();
if (socket) {
socket.emit("chat:leave", conversationId);
}
};

export const onNewMessage = (callback) => {
const socket = getSocket();
if (socket) {
socket.on("chat:newMessage", callback);
}
};

export const markConversationRead = async (conversationId) => {
await chatAPI.markConversationRead(conversationId);
};
