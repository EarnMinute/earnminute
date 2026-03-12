import { useEffect, useState, useRef } from "react";
import {
  getMessages,
  sendMessage,
  joinConversation,
  leaveConversation,
  onNewMessage,
  markConversationRead,
} from "../../services/chatService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { getSocket } from "../../services/socket";

export default function ChatWindow({ conversation }) {
  const { user } = useAuth();
  const currentUserId = user?.user?._id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const messagesRef = useRef(null);
  const typingTimeout = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (conversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);

  useEffect(() => {
    if (!conversation) return;

    loadMessages();

    markConversationRead(conversation._id);

    joinConversation(conversation._id);

    const socket = getSocket();

    const messageHandler = (message) => {
      if (message.conversation !== conversation._id) return;

      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      if (String(senderId) === String(currentUserId)) {
        return; // ignore own socket message
      }

      setMessages((prev) => [...prev, message]);
    };

    const typingHandler = (data) => {
      if (
        data.conversationId === conversation._id &&
        data.userId !== currentUserId
      ) {
        setTypingUser(data.name);

        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
          setTypingUser(null);
        }, 2000);
      }
    };

    if (socket) {
      socket.on("chat:newMessage", messageHandler);
      socket.on("chat:typing", typingHandler);
    }

    return () => {
      leaveConversation(conversation._id);

      if (socket) {
        socket.off("chat:newMessage", messageHandler);
        socket.off("chat:typing", typingHandler);
      }
    };
  }, [conversation, currentUserId]);

  useEffect(() => {
    if (!messagesRef.current) return;

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(conversation._id);

      setMessages(data.reverse());
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const tempMessage = {
      _id: Date.now(),
      content: text,
      sender: { _id: currentUserId },
      createdAt: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMessage]);

    setText("");

    try {
      const msg = await sendMessage(conversation._id, text);

      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempMessage._id ? { ...msg, status: "sent" } : m,
        ),
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempMessage._id ? { ...m, status: "failed" } : m,
        ),
      );
    }
  };

  const handleTyping = (value) => {
    setText(value);

    const socket = getSocket();

    if (socket && conversation) {
      socket.emit("chat:typing", {
        conversationId: conversation._id,
        userId: currentUserId,
        name: user?.user?.name,
      });
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  const isEmployer = conversation.employer?._id === currentUserId;

  const otherUser = isEmployer
    ? conversation.freelancer
    : conversation.employer;

  return (
    <div className="flex flex-col flex-1">
      <div className="p-4 border-b bg-white">
        <div className="font-semibold text-sm text-gray-900">
          {conversation.task?.title || "Task"}
        </div>

        <div className="text-xs text-gray-600 mt-1">
          {isEmployer ? "Freelancer" : "Employer"}: {otherUser?.name}
        </div>

        <div className="flex gap-3 mt-2">
          <Link
            to={`/task/${conversation.task?._id}`}
            className="text-xs text-blue-600 hover:underline"
          >
            View Task
          </Link>

          <button
            className="text-xs text-red-500 hover:underline"
            onClick={() => alert("Dispute system will be implemented later")}
          >
            Report Issue
          </button>
        </div>
      </div>

      <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.sender === "object"
              ? msg.sender._id?.toString()
              : msg.sender?.toString();

          const prev = messages[index - 1];

          const prevSenderId =
            prev && typeof prev.sender === "object"
              ? prev.sender._id
              : prev?.sender;

          const isGrouped = prevSenderId === senderId;

          const next = messages[index + 1];

          const nextSenderId =
            next && typeof next.sender === "object"
              ? next.sender._id
              : next?.sender;

          const isLastInGroup = nextSenderId !== senderId;

          const isMine = String(senderId) === String(currentUserId);

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"} ${
                isGrouped ? "mt-1" : "mt-4"
              }`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`px-4 py-2 text-sm ${
                    isMine
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }
                    ${
                      isMine
                        ? isGrouped
                          ? "rounded-l-lg rounded-tr-lg"
                          : "rounded-lg"
                        : isGrouped
                          ? "rounded-r-lg rounded-tl-lg"
                          : "rounded-lg"
                    }
                  `}
                >
                  {msg.content}
                </div>

                {isLastInGroup && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {msg.status === "sending" && <span>⏳</span>}
                    {msg.status === "sent" && <span>✓</span>}
                    {msg.status === "delivered" && <span>✓✓</span>}
                    {msg.status === "failed" && (
                      <span className="text-red-500">!</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {typingUser && (
          <div className="text-xs text-gray-500 italic">
            {typingUser} is typing...
          </div>
        )}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
