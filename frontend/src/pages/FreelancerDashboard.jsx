import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function FreelancerDashboard() {
  const [freelancer, setFreelancer] = useState({});
  const [dashboard, setDashboard] = useState({
    applied: [],
    assigned: [],
    completed: [],
    rejected: [],
  });

  const [activeTab, setActiveTab] = useState("applied");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/applications/freelancer/dashboard");

      setFreelancer(res.data.freelancer || {});
      setDashboard({
        applied: res.data.applied || [],
        assigned: res.data.assigned || [],
        completed: res.data.completed || [],
        rejected: res.data.rejected || [],
      });
    } catch (error) {
      console.error("Error loading freelancer dashboard:", error);
    }
  };

  const renderTasks = (tasks, badgeColor, badgeText) => {
    if (!tasks.length) {
      return (
        <p className="text-gray-500 text-sm mt-4">No tasks in this section.</p>
      );
    }

    return tasks.map((app, index) => (
      <div
        key={app._id}
        className="bg-white p-6 rounded-xl shadow-md mb-6 flex justify-between items-center"
      >
        <div>
          <h3>
            {index + 1}. {app.task?.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Budget: ৳ {app.task?.budgetAmount}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Employer: {app.task?.employer?.name}
          </p>
        </div>

        <span className={`px-3 py-1 text-xs rounded-full ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex relative">
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1>Freelancer Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Browse tasks and manage your assigned work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {activeTab === "applied" &&
                renderTasks(
                  dashboard.applied,
                  "bg-yellow-100 text-yellow-700",
                  "Applied",
                )}

              {activeTab === "assigned" &&
                renderTasks(
                  dashboard.assigned,
                  "bg-green-100 text-green-700",
                  "Assigned",
                )}

              {activeTab === "completed" &&
                renderTasks(
                  dashboard.completed,
                  "bg-blue-100 text-blue-700",
                  "Completed",
                )}

              {activeTab === "rejected" &&
                renderTasks(
                  dashboard.rejected,
                  "bg-red-100 text-red-700",
                  "Rejected",
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center h-fit">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />

              <Link to={`/freelancer/profile/${freelancer._id}`}>
                <h2 className="font-semibold text-lg hover:text-blue-800 cursor-pointer">
                  {freelancer?.name}
                </h2>
              </Link>

              <p className="text-yellow-500 mt-2">
                ⭐ {freelancer?.rating?.average || 0}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                ({freelancer?.rating?.count || 0} reviews)
              </p>

              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-500">Total Completed Tasks</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">
                  {dashboard.completed.length}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/tasks"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-700 transition"
            >
              Browse New Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
