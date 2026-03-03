import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-900">
            Earn<span className="text-orange-500">Minute</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/tasks"
              className="text-gray-600 hover:text-blue-900 font-medium transition"
            >
              Browse Tasks
            </Link>

            {user && user.role === "employer" && (
              <Link
                to="/post-task"
                className="text-gray-600 hover:text-blue-900 font-medium transition"
              >
                Post Task
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-900 font-medium transition"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                    {user.name}
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

          {/* Mobile Placeholder */}
          <div className="md:hidden text-gray-700 text-xl">☰</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
