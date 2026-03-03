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
        className="bg-white p-5 rounded-xl shadow mb-4 flex justify-between items-center"
      >
        <div>
          <h3 className="font-semibold text-lg">
            {index + 1}. {app.task?.title}
          </h3>
          <p className="text-sm text-gray-600">
            Budget: ৳ {app.task?.budgetAmount}
          </p>
          <p className="text-sm text-gray-500">
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-blue-900">
          Welcome back, {freelancer?.name}
        </h1>
        <p className="text-gray-500 mt-2">
          Browse tasks and manage your assigned work.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT SIDE (Tasks) */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="flex gap-8 border-b mb-8">
            {["applied", "assigned", "completed", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-800 text-blue-800 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

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

        {/* RIGHT SIDE (Profile Card) */}
        <div className="bg-white p-6 rounded-xl shadow text-center h-fit">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />

          <h2 className="font-semibold text-lg">{freelancer?.name}</h2>

          {/* Star Rating */}
          <div className="text-yellow-500 mt-2">
            {"★".repeat(Math.round(freelancer?.rating?.average || 0))}
            {"☆".repeat(5 - Math.round(freelancer?.rating?.average || 0))}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            ({freelancer?.rating?.count || 0} reviews)
          </p>

          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-500">Total Completed Tasks</p>
            <p className="text-2xl font-bold text-blue-900">
              {dashboard.completed.length}
            </p>
          </div>
        </div>
      </div>

      {/* Browse New Tasks */}
      <div className="mt-12 text-center">
        <Link
          to="/tasks"
          className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-700 transition"
        >
          Browse New Tasks
        </Link>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
