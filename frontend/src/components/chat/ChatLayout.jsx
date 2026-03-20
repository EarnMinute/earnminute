import { useEffect, useState } from "react";
import { getConversations } from "@/services/chatService";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout({ initialConversationId }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true); // ✅ NEW

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
          setShowSidebar(false); // mobile direct open
        }
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    setShowSidebar(false); // mobile switch
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      {/* SIDEBAR */}
      <div
        className={`
          ${showSidebar ? "block" : "hidden"}
          md:block w-full md:w-80 border-r
        `}
      >
        <ChatSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={handleSelectConversation}
        />
      </div>

      {/* CHAT */}
      <div
        className={`
          ${showSidebar ? "hidden" : "flex"}
          md:flex flex-1 flex-col
        `}
      >
        {/* MOBILE BACK */}
        <div className="md:hidden p-3 border-b">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-sm text-blue-600"
          >
            ← Back
          </button>
        </div>

        <ChatWindow conversation={activeConversation} />
      </div>
    </div>
  );
}
