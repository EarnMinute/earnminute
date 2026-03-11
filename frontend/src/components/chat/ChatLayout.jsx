import { useEffect, useState } from "react";
import { getConversations } from "../../services/chatService";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout({ initialConversationId }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);

      if (initialConversationId) {
        const found = data.find((c) => c._id === initialConversationId);

        if (found) {
          setActiveConversation(found);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-lg overflow-hidden bg-white">
      <ChatSidebar
        conversations={conversations}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
      />

      <ChatWindow conversation={activeConversation} />
    </div>
  );
}
