import { Link } from "react-router-dom";
import LiveActivityFeed from "../../components/LiveActivityFeed";

function GuestEmployerPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Hire Skilled Freelancers in{" "}
              <span className="text-orange-400">Minutes</span>
            </h1>

            <p className="text-blue-100 mt-6 text-lg">
              Post your task, receive applications from freelancers, and get
              work done quickly through a simple and transparent hiring process.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition shadow-lg"
              >
                Post a Task
              </Link>

              <Link
                to="/freelancers"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg"
              >
                Browse Freelancers
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
          Hiring Made Simple
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="font-semibold text-lg mb-2">Post a Task</h3>
            <p className="text-gray-500">
              Describe your task, set a budget, and publish it on the
              marketplace.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">👨‍💻</div>
            <h3 className="font-semibold text-lg mb-2">Receive Applications</h3>
            <p className="text-gray-500">
              Freelancers apply to your task and you can review their profiles.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-semibold text-lg mb-2">Hire & Get Work Done</h3>
            <p className="text-gray-500">
              Choose the best freelancer and track the task until completion.
            </p>
          </div>
        </div>
      </div>

      {/* ================= BENEFITS ================= */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-14">
            Why Use EarnMinute?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Fast Hiring</h3>
              <p className="text-gray-500">
                Post a task and start receiving freelancer applications within
                minutes.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">
                Skilled Freelancers
              </h3>
              <p className="text-gray-500">
                Work with freelancers who specialize in different online
                services.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Simple Workflow</h3>
              <p className="text-gray-500">
                Manage tasks, applications, and hiring in one simple dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FINAL CTA ================= */}
      <div className="bg-blue-900 text-white py-24 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to hire your first freelancer?
        </h2>

        <p className="text-blue-100 mb-10">
          Join EarnMinute and start posting tasks today.
        </p>

        <Link
          to="/register"
          className="bg-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Create Employer Account
        </Link>
      </div>
    </div>
  );
}

export default GuestEmployerPage;
