import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import API from "@/services/api";
import NotificationDropdown from "./NotificationDropdown";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    const role = user?.user?.role;
    if (role === "admin") return "/admin/dashboard";
    if (role === "employer") return "/employer/dashboard";
    if (role === "freelancer") return "/freelancer/dashboard";
    return "/";
  };

  const getProfileLink = () => {
    if (!user) return "/";
    const role = user?.user?.role;
    const id = user?.user?._id;

    if (role === "freelancer") return `/freelancer/profile/${id}`;
    if (role === "employer") return `/employer/profile/${id}`;

    return getDashboardLink();
  };

  const isEmployerPage = location.pathname.startsWith("/employers");
  const isFreelancerPage = location.pathname.startsWith("/freelancers");

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/notifications/unread-count");
      setUnreadCount(res.data.unreadCount || 0);
    } catch {}
  };

  const fetchChatUnread = async () => {
    if (!user) return;

    try {
      const res = await API.get("/chat/conversations");
      const conversations = res?.data?.conversations || [];

      let total = 0;
      for (const conv of conversations) {
        if (conv.unreadCount) total += conv.unreadCount;
      }

      setChatUnread(total);
    } catch {}
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchChatUnread();

      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchChatUnread();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-900">
            Earn<span className="text-orange-500">Minute</span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {(isFreelancerPage || !user) && (
              <Link to="/tasks">Browse Tasks</Link>
            )}

            {(isEmployerPage || user?.user?.role === "employer") && (
              <Link to="/post-task">Post Task</Link>
            )}

            {user ? (
              <>
                <Link to={getProfileLink()}>Profile</Link>
                <Link to={getDashboardLink()}>Dashboard</Link>

                <Link to="/messages" className="relative">
                  💬
                  {chatUnread > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                      {chatUnread}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setMobileOpen(false); // close drawer
                      setShowNotifications(true); // open dropdown
                    }}
                  >
                    🔔
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

                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Get Started</Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* RIGHT DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 space-y-4 text-right">
          {/* NAV */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">Navigation</p>

            {(isFreelancerPage || !user) && (
              <Link
                to="/tasks"
                onClick={() => setMobileOpen(false)}
                className="block py-2"
              >
                Browse Tasks
              </Link>
            )}

            {(isEmployerPage || user?.user?.role === "employer") && (
              <Link
                to="/post-task"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-semibold text-blue-600"
              >
                Post Task
              </Link>
            )}

            {user && (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 font-semibold"
                >
                  Dashboard
                </Link>

                <Link
                  to={getProfileLink()}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* COMMUNICATION */}
          {user && (
            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">
                Communication
              </p>

              <Link
                to="/messages"
                onClick={() => setMobileOpen(false)}
                className="block py-2"
              >
                Messages ({chatUnread})
              </Link>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="block w-full py-2"
              >
                Notifications ({unreadCount})
              </button>
            </div>
          )}

          {/* AUTH */}
          <div className="border-t pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-red-500 w-full py-2"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block py-2">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block py-2 text-blue-600 font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
