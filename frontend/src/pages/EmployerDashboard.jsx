import { useEffect, useState } from "react";
import API from "../services/api";
import RatingModal from "../components/RatingModal";

function EmployerDashboard() {
  const [dashboard, setDashboard] = useState({
    open: [],
    assigned: [],
    completed: [],
  });

  const [activeTab, setActiveTab] = useState("open");
  const [expandedTask, setExpandedTask] = useState(null);
  const [applications, setApplications] = useState([]);
  const [ratingTaskId, setRatingTaskId] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/tasks/employer/dashboard");
      setDashboard({
        open: res.data.open || [],
        assigned: res.data.assigned || [],
        completed: res.data.completed || [],
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const toggleTask = async (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
      setApplications([]);
      return;
    }

    try {
      const res = await API.get(`/applications/${taskId}`);
      setApplications(res.data.applications);
      setExpandedTask(taskId);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const handleAssign = async (taskId, applicationId) => {
    if (!window.confirm("Assign this freelancer?")) return;

    try {
      await API.patch(`/applications/${taskId}/assign/${applicationId}`);
      setExpandedTask(null);
      fetchDashboard();
    } catch (error) {
      console.error("Assign error:", error);
    }
  };

  const handleComplete = async (taskId) => {
    if (!window.confirm("Mark task as completed?")) return;

    try {
      await API.patch(`/tasks/${taskId}/complete`);
      setRatingTaskId(taskId);
      fetchDashboard();
    } catch (error) {
      console.error("Complete error:", error);
    }
  };

  const totalTasks =
    dashboard.open.length +
    dashboard.assigned.length +
    dashboard.completed.length;

  const menuItems = [
    { key: "open", label: "Open", icon: "📂" },
    { key: "assigned", label: "Assigned", icon: "👤" },
    { key: "completed", label: "Completed", icon: "✅" },
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
            <h2 className="text-lg font-semibold text-blue-900">Employer</h2>
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
      <div className="flex-1 p-6 md:p-10 ml-0 md:ml-0">
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
            <h1>Employer Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Manage your tasks and applications efficiently.
            </p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {totalTasks}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {dashboard.open.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">
                {dashboard.completed.length}
              </p>
            </div>
          </div>

          {/* TASK CONTENT */}
          {activeTab === "open" &&
            dashboard.open.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md mb-6 overflow-hidden"
              >
                <div
                  onClick={() => toggleTask(task._id)}
                  className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <div>
                    <h3>{task.title}</h3>
                    <p className="text-green-600 font-semibold mt-1">
                      ৳ {task.budgetAmount}
                    </p>
                  </div>

                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {task.applicationsCount} Applications
                  </span>
                </div>

                {expandedTask === task._id && (
                  <div className="border-t bg-gray-50 p-6 space-y-4">
                    {applications.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No applications yet.
                      </p>
                    ) : (
                      applications.map((app) => (
                        <div
                          key={app._id}
                          className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold">
                              {app.freelancer.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Rating: {app.freelancer.ratingAverage || 0}
                            </p>
                          </div>

                          <button
                            onClick={() => handleAssign(task._id, app._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                          >
                            Assign
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}

          {activeTab === "assigned" &&
            dashboard.assigned.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center"
              >
                <div>
                  <h3>{task.title}</h3>
                  <p className="text-green-600 font-semibold mt-1">
                    ৳ {task.budgetAmount}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Assigned to: {task.assignedFreelancer?.name}
                  </p>
                </div>

                <button
                  onClick={() => handleComplete(task._id)}
                  className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Mark as Completed
                </button>
              </div>
            ))}

          {activeTab === "completed" &&
            dashboard.completed.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md p-6 mb-6"
              >
                <h3>{task.title}</h3>
                <p className="text-green-600 font-semibold mt-1">
                  ৳ {task.budgetAmount}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Completed by: {task.assignedFreelancer?.name}
                </p>

                <span className="inline-block mt-3 px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Completed ✔
                </span>
              </div>
            ))}

          {ratingTaskId && (
            <RatingModal
              taskId={ratingTaskId}
              onClose={() => setRatingTaskId(null)}
              onSuccess={fetchDashboard}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
