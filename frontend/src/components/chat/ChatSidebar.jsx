import { useAuth } from "@/context/AuthContext";

export default function ChatSidebar({
  conversations,
  activeConversation,
  setActiveConversation,
}) {
  const { user } = useAuth();
  const currentUserId = user?.user?._id;

  return (
    <div className="w-80 border-r bg-gray-50 overflow-y-auto">
      <div className="p-4 border-b font-semibold text-lg">Messages</div>

      {conversations.length === 0 && (
        <div className="p-4 text-sm text-gray-500">No conversations yet</div>
      )}

      {conversations.map((conv) => {
        const isActive = activeConversation?._id === conv._id;

        const isEmployer = conv.employer?._id === currentUserId;

        const otherUser = isEmployer ? conv.freelancer : conv.employer;

        const roleLabel = isEmployer ? "Freelancer" : "Employer";

        const unread = conv.unreadCount || 0;

        return (
          <div
            key={conv._id}
            onClick={() => setActiveConversation(conv)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition ${
              isActive ? "bg-gray-200" : ""
            }`}
          >
            <div className="font-semibold text-sm text-gray-800 truncate">
              {conv.task?.title || "Task"}
            </div>

            <div className="text-xs text-gray-600 mt-1">
              {roleLabel}: {otherUser?.name || "User"}
            </div>

            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500 truncate">
                {conv.lastMessage || "Start chatting"}
              </div>

              {unread > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
