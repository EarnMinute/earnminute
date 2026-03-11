import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import NotificationDropdown from "./NotificationDropdown";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

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
FETCH UNREAD COUNT
=============================== */

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/notifications/unread-count");

      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Unread count fetch error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  /* ===============================
CLOSE DROPDOWN ON OUTSIDE CLICK
=============================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

            {/* Post Task */}

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

                {/* Notification Bell */}

                <div className="relative" ref={notificationRef}>
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
                    <NotificationDropdown
                      onClose={() => {
                        setShowNotifications(false);
                        fetchUnreadCount();
                      }}
                    />
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
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-900 font-medium transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}

          <div className="md:hidden text-gray-700 text-xl">☰</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
