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
      {/* HERO SECTION */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Find Online Tasks & Start Earning Today
          </h1>
          <p className="text-gray-600 mb-8">
            A modern platform for simple online tasks in Bangladesh.
          </p>

          <div className="flex justify-center gap-2">
            <Link
              to="/tasks"
              className="bg-blue-800 text-white px-6 py-3 rounded hover:bg-blue-900"
            >
              Browse Tasks
            </Link>

            <Link
              to="/post-task"
              className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
            >
              Post a Task
            </Link>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="bg-white border-t border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-center gap-16 text-center">
          <div>
            <p className="text-blue-900 font-semibold text-lg">
              {stats.totalTasks}+
            </p>
            <p className="text-gray-500 text-sm">Tasks Posted</p>
          </div>

          <div>
            <p className="text-green-600 font-semibold text-lg">
              ৳ {stats.totalEarned}
            </p>
            <p className="text-gray-500 text-sm">Earned</p>
          </div>

          <div>
            <p className="text-yellow-500 font-semibold text-lg">Trusted</p>
            <p className="text-gray-500 text-sm">by Freelancers</p>
          </div>
        </div>
      </div>

      {/* LATEST TASKS */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-blue-900">
          Latest Online Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >
                <h3 className="font-semibold text-lg mb-2 text-blue-900">
                  {task.title}
                </h3>

                <p className="text-green-600 font-semibold mb-2">
                  ৳ {task.budgetAmount}
                </p>

                <p className="text-gray-500 text-sm mb-4">
                  {task.description?.slice(0, 80)}...
                </p>

                <Link
                  to={`/task/${task._id}`}
                  className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA SECTION */}
      <div className="bg-gray-100 py-16 text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Ready to get started?
        </h2>

        <div className="flex justify-center gap-4">
          <Link
            to="/tasks"
            className="bg-blue-800 text-white px-6 py-3 rounded hover:bg-blue-900"
          >
            Browse Tasks
          </Link>

          <Link
            to="/register"
            className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
