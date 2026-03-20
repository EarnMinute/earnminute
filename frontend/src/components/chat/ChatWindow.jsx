import { useEffect, useState, useRef } from "react";
import {
  getMessages,
  sendMessage,
  joinConversation,
  leaveConversation,
  onNewMessage,
  markConversationRead,
} from "@/services/chatService";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { getSocket } from "@/services/socket";
import { raiseDispute } from "@/api/disputeApi";

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

      if (String(senderId) === String(currentUserId)) return;

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
    } catch {
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
        Select a conversation
      </div>
    );
  }

  const isEmployer = conversation.employer?._id === currentUserId;
  const otherUser = isEmployer
    ? conversation.freelancer
    : conversation.employer;

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* HEADER */}
      <div className="p-3 sm:p-4 border-b bg-white">
        <div className="font-semibold text-sm truncate">
          {conversation.task?.title || "Task"}
        </div>

        <div className="text-xs text-gray-600 mt-1 truncate">
          {isEmployer ? "Freelancer" : "Employer"}: {otherUser?.name}
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <Link
            to={`/task/${conversation.task?._id}`}
            className="text-xs text-blue-600"
          >
            View Task
          </Link>

          <button
            className="text-xs text-red-500"
            onClick={async () => {
              const reason = prompt("Enter dispute reason:");
              if (!reason) return;

              const description = prompt("Describe the issue:");
              if (!description) return;

              try {
                await raiseDispute({
                  taskId: conversation.task?._id,
                  reason,
                  description,
                });

                alert("Dispute raised successfully");
              } catch (err) {
                alert(err.response?.data?.message || "Failed");
              }
            }}
          >
            Report Issue
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
      >
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.sender === "object"
              ? msg.sender._id?.toString()
              : msg.sender?.toString();

          const isMine = String(senderId) === String(currentUserId);

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                <div
                  className={`px-3 py-2 text-sm break-words ${
                    isMine
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  } rounded-lg`}
                >
                  {msg.content}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
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

      {/* INPUT */}
      <div className="p-2 sm:p-3 border-t flex gap-2 bg-white">
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
