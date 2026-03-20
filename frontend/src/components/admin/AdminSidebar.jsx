import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

function AdminSidebar({ onNavigate }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnread = async () => {
    try {
      const res = await api.get("/feedback?status=new");
      setUnreadCount(res.data.feedbacks?.length || 0);
    } catch {}
  };

  useEffect(() => {
    loadUnread();
  }, []);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Tasks", path: "/admin/tasks" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Feedbacks", path: "/admin/feedbacks" },
  ];

  return (
    <aside className="w-64 p-6">
      <h2 className="text-xl font-bold text-blue-900 mb-8">Admin Panel</h2>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`flex justify-between items-center px-4 py-2 rounded-lg ${
              location.pathname === item.path
                ? "bg-blue-100 text-blue-900 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{item.name}</span>

            {item.name === "Feedbacks" && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
