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

  const menuItems = [
    { key: "applied", label: "Applied", icon: "📄" },
    { key: "assigned", label: "Assigned", icon: "👤" },
    { key: "completed", label: "Completed", icon: "✅" },
    { key: "rejected", label: "Rejected", icon: "❌" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex relative">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full bg-white border-r shadow-sm
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="p-6 flex justify-between items-center">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-blue-900">Freelancer</h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-gray-500 hover:text-blue-900"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2 px-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${
                activeTab === item.key
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10">
        {/* MOBILE HEADER */}
        <div className="md:hidden mb-6 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-10 hidden md:block">
            <h1>Freelancer Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Browse tasks and manage your assigned work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* TASK LIST */}
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

            {/* PROFILE CARD */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center h-fit">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />

              <h2>{freelancer?.name}</h2>

              <div className="text-yellow-500 mt-2">
                {"★".repeat(Math.round(freelancer?.rating?.average || 0))}
                {"☆".repeat(5 - Math.round(freelancer?.rating?.average || 0))}
              </div>

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

          {/* Browse Button */}
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
