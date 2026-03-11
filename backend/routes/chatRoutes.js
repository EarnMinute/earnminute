const express = require("express");
const chatController = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/conversations", chatController.getUserConversations);

router.post("/conversations", chatController.startConversation);

router.get(
"/conversations/:conversationId/messages",
chatController.getMessages
);

router.post("/messages", chatController.sendMessage);

router.patch(
"/conversations/:conversationId/read",
chatController.markConversationRead
);

module.exports = router;