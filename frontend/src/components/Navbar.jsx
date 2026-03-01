import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={logo}
            alt="EarnMinute"
            className="h-8 w-auto object-contain"
          />
          <span className="text-lg font-semibold text-gray-900 tracking-wide">
            EarnMinute
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-black transition">
            Home
          </Link>

          {user?.user?.role === "employer" && (
            <>
              <Link
                to="/employer/dashboard"
                className="hover:text-black transition"
              >
                Dashboard
              </Link>
              <Link to="/post-task" className="hover:text-black transition">
                Post Task
              </Link>
            </>
          )}

          {user?.user?.role === "freelancer" && (
            <Link
              to="/freelancer/dashboard"
              className="hover:text-black transition"
            >
              Dashboard
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-black transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
