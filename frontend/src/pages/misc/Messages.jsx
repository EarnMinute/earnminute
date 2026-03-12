import { useLocation } from "react-router-dom";
import ChatLayout from "@/components/chat/ChatLayout";

export default function Messages() {
  const location = useLocation();

  const conversationId = location.state?.conversationId || null;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ChatLayout initialConversationId={conversationId} />
    </div>
  );
}
