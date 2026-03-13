const conversationRepository = require("../repositories/conversationRepository");
const messageRepository = require("../repositories/messageRepository");
const taskRepository = require("../repositories/taskRepository");
const applicationRepository = require("../repositories/applicationRepository");

exports.startConversation = async (taskId, freelancerId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const application = await applicationRepository.findByTaskAndFreelancer(
    taskId,
    freelancerId,
  );

  if (!application && task.assignedFreelancer?.toString() !== freelancerId) {
    throw new Error(
      "You are not allowed to start a conversation for this task",
    );
  }

  let conversation =
    await conversationRepository.findConversationByTaskAndFreelancer(
      taskId,
      freelancerId,
    );

  if (!conversation) {
    conversation = await conversationRepository.createConversation({
      task: taskId,
      employer: task.employer,
      freelancer: freelancerId,
    });
  }

  return conversation;
};

exports.getUserConversations = async (userId, page = 1, limit = 20) => {
  const conversations = await conversationRepository.getUserConversations(
    userId,
    page,
    limit,
  );

  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const unread = await messageRepository.countUnreadMessages(
        conv._id,
        userId,
      );

      return {
        ...conv.toObject(),
        unreadCount: unread,
      };
    }),
  );

  return enriched;
};

exports.getMessages = async (conversationId, page = 1, limit = 30) => {
  const skip = (page - 1) * limit;

  return messageRepository.getMessagesByConversation(
    conversationId,
    limit,
    skip,
  );
};

exports.sendMessage = async (conversationId, senderId, content, io) => {
  const conversation =
    await conversationRepository.findConversationById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant =
    conversation.employer._id.toString() === senderId ||
    conversation.freelancer._id.toString() === senderId;

  if (!isParticipant) {
    throw new Error("Not authorized to send message");
  }

  const message = await messageRepository.createMessage({
    conversation: conversationId,
    sender: senderId,
    content,
  });

  await conversationRepository.updateLastMessage(conversationId, content);

  const populatedMessage = await message.populate("sender", "name role");

  if (io) {
    io.to(conversationId).emit("chat:newMessage", {
      ...populatedMessage.toObject(),
      status: "delivered",
    });
  }

  return populatedMessage;
};

exports.markConversationRead = async (conversationId, userId) => {
  return messageRepository.markMessagesAsRead(conversationId, userId);
};
