import { Link } from "react-router-dom";
import { useEffect } from "react";
import API from "@/services/api";

function RoleSelectionPage() {
  useEffect(() => {
    API.post("/analytics/visit").catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      {/* ===== HERO / INTRO ===== */}
      <div className="max-w-5xl mx-auto px-6 text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
          Welcome to <span className="text-orange-500">EarnMinute</span>
        </h1>

        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
          EarnMinute is currently in{" "}
          <span className="font-semibold">public beta</span>. You are exploring
          an early version of the platform. Your feedback will help us improve
          the experience.
        </p>

        <p className="text-gray-500 mt-2">
          If you encounter any issues or have suggestions, please share them
          through the{" "}
          <span className="font-medium">Feedback section in the footer</span>.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-14">
          How would you like to explore EarnMinute?
        </h2>

        <p className="text-gray-500 mt-2">
          Choose the role that best matches your interest.
        </p>
      </div>

      {/* ===== ROLE CARDS ===== */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FREELANCER CARD */}
          <div className="bg-white rounded-2xl shadow-md p-10 border hover:shadow-xl transition">
            <div className="text-5xl mb-4">👨‍💻</div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Explore as Freelancer
            </h3>

            <p className="text-gray-500 mb-6">
              Find quick freelance tasks and start earning by completing short
              online jobs posted by employers.
            </p>

            <Link
              to="/freelancers"
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Continue as Freelancer
            </Link>
          </div>

          {/* EMPLOYER CARD */}
          <div className="bg-white rounded-2xl shadow-md p-10 border hover:shadow-xl transition">
            <div className="text-5xl mb-4">💼</div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Explore as Employer
            </h3>

            <p className="text-gray-500 mb-6">
              Post tasks and hire skilled freelancers to complete work quickly
              and efficiently.
            </p>

            <Link
              to="/employers"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              Continue as Employer
            </Link>
          </div>
        </div>
      </div>

      {/* ===== FOOT NOTE ===== */}
      <div className="text-center pb-16 px-6">
        <p className="text-gray-500">
          You can switch roles anytime. Create an account or log in to unlock
          the full platform experience.
        </p>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
