import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-md">
        {/* ICON */}
        <div className="text-5xl mb-4">🔍</div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-blue-900 mb-3">
          404 - Page Not Found
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* ACTION BUTTON */}
        <Link
          to="/"
          className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
