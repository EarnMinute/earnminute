import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";

    const role = user?.user?.role;

    if (role === "admin") return "/admin/dashboard";
    if (role === "employer") return "/employer/dashboard";
    if (role === "freelancer") return "/freelancer/dashboard";

    return "/";
  };

  const isEmployerPage = location.pathname.startsWith("/employers");
  const isFreelancerPage = location.pathname.startsWith("/freelancers");

  /* ===============================
     FETCH NOTIFICATIONS
  ================================ */
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  /* ===============================
     MARK AS READ
  ================================ */
  const handleRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Notification read error:", error);
    }
  };

  const handleMarkAll = async () => {
    try {
      await API.patch("/notifications/read-all");
      fetchNotifications();
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-900">
            Earn<span className="text-orange-500">Minute</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {/* Browse Tasks */}
            {(isFreelancerPage || !user) && (
              <Link
                to="/tasks"
                className="text-gray-600 hover:text-blue-900 font-medium transition"
              >
                Browse Tasks
              </Link>
            )}

            {/* Post Task for Employer Pages */}
            {(isEmployerPage || user?.user?.role === "employer") && (
              <Link
                to="/post-task"
                className="text-gray-600 hover:text-blue-900 font-medium transition"
              >
                Post Task
              </Link>
            )}

            {user ? (
              <>
                {/* Dashboard */}
                <Link
                  to={getDashboardLink()}
                  className="text-gray-600 hover:text-blue-900 font-medium transition"
                >
                  Dashboard
                </Link>

                {/* ===============================
                    NOTIFICATION BELL
                ================================ */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-xl"
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50">
                      <div className="flex justify-between items-center px-4 py-3 border-b">
                        <span className="font-semibold">Notifications</span>

                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAll}
                            className="text-sm text-blue-600"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                          <p className="p-4 text-gray-500 text-sm">
                            No notifications
                          </p>
                        )}

                        {notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              handleRead(n._id);
                              setShowNotifications(false);
                              if (n.link) navigate(n.link);
                            }}
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
                      </div>
                    </div>
                  )}
                </div>

                {/* User Badge */}
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                    {user?.user?.name}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-900 font-medium transition"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden text-gray-700 text-xl">☰</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
