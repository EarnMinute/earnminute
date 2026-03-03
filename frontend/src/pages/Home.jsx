import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalEarned: 0,
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.slice(0, 6));
    } catch (err) {
      console.error("Failed to load tasks");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/analytics/public");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-28 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            Earn Money by Completing{" "}
            <span className="text-orange-400">Simple Online Tasks</span>
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto mt-6 mb-12">
            A trusted marketplace in Bangladesh connecting task posters with
            skilled freelancers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/tasks"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition shadow-lg"
            >
              Browse Tasks
            </Link>

            <Link
              to="/post-task"
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg"
            >
              Post a Task
            </Link>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-blue-900">
              {stats.totalTasks}+
            </p>
            <p className="text-gray-500 mt-2">Tasks Posted</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              ৳ {stats.totalEarned}
            </p>
            <p className="text-gray-500 mt-2">Total Earned</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-orange-500">Growing</p>
            <p className="text-gray-500 mt-2">Freelancer Community</p>
          </div>
        </div>
      </div>

      {/* ================= LATEST TASKS ================= */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2>Latest Online Tasks</h2>

          <Link
            to="/tasks"
            className="text-blue-800 font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
              >
                <h3>{task.title}</h3>

                <p className="text-green-600 font-semibold mb-3 text-lg">
                  ৳ {task.budgetAmount}
                </p>

                <p className="text-gray-500 text-sm mb-6">
                  {task.description?.slice(0, 90)}...
                </p>

                <Link
                  to={`/task/${task._id}`}
                  className="inline-block bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= FINAL CTA ================= */}
      <div className="bg-blue-900 text-white py-20 text-center">
        <h2>Start earning or hire talent today</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/tasks"
            className="bg-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Browse Tasks
          </Link>

          <Link
            to="/register"
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
