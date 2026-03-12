import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";

function NotificationDropdown({ onClose }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ===============================
FETCH NOTIFICATIONS
================================ */
  const fetchNotifications = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await API.get(`/notifications?page=${pageNumber}`);
      const data = res.data;

      if (pageNumber === 1) {
        setNotifications(data.notifications || []);
      } else {
        setNotifications((prev) => [...prev, ...(data.notifications || [])]);
      }

      setUnreadCount(data.unreadCount || 0);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  /* ===============================
INFINITE SCROLL
================================ */
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;

    if (bottom && !loading && page < totalPages) {
      fetchNotifications(page + 1);
    }
  };

  /* ===============================
MARK SINGLE READ
================================ */
  const handleRead = async (id, link) => {
    try {
      await API.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );

      if (link) navigate(link);

      if (onClose) onClose();
    } catch (error) {
      console.error("Notification read error:", error);
    }
  };

  /* ===============================
MARK ALL READ
================================ */
  const handleMarkAll = async () => {
    try {
      await API.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <span className="font-semibold">Notifications</span>

        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className="text-sm text-blue-600">
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto" onScroll={handleScroll}>
        {notifications.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleRead(n._id, n.link)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              !n.isRead ? "bg-blue-50" : ""
            }`}
          >
            <p className="text-sm">{n.message}</p>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {loading && (
          <p className="p-3 text-center text-sm text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
