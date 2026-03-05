import { Link } from "react-router-dom";
import LiveActivityFeed from "../components/LiveActivityFeed";

function GuestFreelancerPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Start Earning by Completing{" "}
              <span className="text-orange-400">Online Tasks</span>
            </h1>

            <p className="text-blue-100 mt-6 text-lg">
              Join EarnMinute and work on simple freelance tasks posted by
              employers. Build your profile, complete tasks, and start earning
              money online.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/tasks"
                className="bg-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition shadow-lg"
              >
                Browse Tasks
              </Link>

              <Link
                to="/register"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg"
              >
                Join as Freelancer
              </Link>
            </div>
          </div>

          {/* Illustration Placeholder */}
          <div className="hidden md:flex justify-center">
            <LiveActivityFeed />
          </div>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center text-blue-900 mb-14">
          How Earning Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-lg mb-2">Browse Tasks</h3>
            <p className="text-gray-500">
              Explore available tasks posted by employers on the platform.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="font-semibold text-lg mb-2">Apply for Tasks</h3>
            <p className="text-gray-500">
              Submit your application and show why you are the right person for
              the task.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-semibold text-lg mb-2">Complete & Earn</h3>
            <p className="text-gray-500">
              Finish the task successfully and earn money for your work.
            </p>
          </div>
        </div>
      </div>

      {/* ================= BENEFITS ================= */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-14">
            Why Work on EarnMinute?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Flexible Work</h3>
              <p className="text-gray-500">
                Choose tasks that fit your skills and schedule.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">
                Growing Marketplace
              </h3>
              <p className="text-gray-500">
                New tasks are posted regularly by employers.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">
                Build Your Reputation
              </h3>
              <p className="text-gray-500">
                Complete tasks successfully and earn positive ratings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FINAL CTA ================= */}
      <div className="bg-blue-900 text-white py-24 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to start earning online?
        </h2>

        <p className="text-blue-100 mb-10">
          Create your freelancer account and explore available tasks.
        </p>

        <Link
          to="/register"
          className="bg-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Create Freelancer Account
        </Link>
      </div>
    </div>
  );
}

export default GuestFreelancerPage;
