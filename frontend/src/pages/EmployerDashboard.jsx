import { useEffect, useState } from "react";
import API from "../services/api";
import RatingModal from "../components/RatingModal";
import { Link } from "react-router-dom";

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
      console.error("Dashboard error:", error);
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
      console.error("Applications load error:", error);
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
    if (!window.confirm("Mark task completed?")) return;

    try {
      await API.patch(`/tasks/${taskId}/complete`);
      setRatingTaskId(taskId);
      fetchDashboard();
    } catch (error) {
      console.error("Complete error:", error);
    }
  };

  const menuItems = [
    { key: "open", label: "Open Tasks" },
    { key: "assigned", label: "Assigned Tasks" },
    { key: "completed", label: "Completed Tasks" },
  ];

  const renderBadge = (task) => {
    if (activeTab === "open") {
      return (
        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
          {task.applicationsCount || 0} Applications
        </span>
      );
    }

    if (activeTab === "assigned") {
      return (
        <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
          Assigned to {task.assignedFreelancer?.name || "Freelancer"}
        </span>
      );
    }

    if (activeTab === "completed") {
      return (
        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
          Completed by {task.assignedFreelancer?.name || "Freelancer"}
        </span>
      );
    }
  };

  const renderTask = (task) => (
    <div
      key={task._id}
      className="bg-white rounded-xl shadow-md mb-6 overflow-hidden"
    >
      <div
        onClick={() => toggleTask(task._id)}
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50"
      >
        <div>
          <h3 className="font-semibold">{task.title}</h3>

          <p className="text-green-600 font-semibold mt-1">
            ৳ {task.budgetAmount}
          </p>
        </div>

        {renderBadge(task)}
      </div>

      {activeTab === "open" && expandedTask === task._id && (
        <div className="border-t bg-gray-50 p-6 space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{app.freelancer.name}</p>

                <p className="text-sm text-gray-500">
                  ⭐ {app.freelancer?.rating?.average || 0} (
                  {app.freelancer?.rating?.count || 0} reviews)
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/freelancer/profile/${app.freelancer._id}`}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  View Profile
                </Link>

                <button
                  onClick={() => handleAssign(task._id, app._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "assigned" && (
        <div className="border-t p-6">
          <button
            onClick={() => handleComplete(task._id)}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Mark Completed
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r p-6">
        <h2 className="text-lg font-semibold mb-6">Employer</h2>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeTab === item.key
                  ? "bg-blue-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">Employer Dashboard</h1>

        {dashboard[activeTab].length === 0 && (
          <p className="text-gray-500">No tasks in this section.</p>
        )}

        {dashboard[activeTab].map(renderTask)}

        {ratingTaskId && (
          <RatingModal
            taskId={ratingTaskId}
            onClose={() => setRatingTaskId(null)}
            onSuccess={fetchDashboard}
          />
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
