import { useEffect, useState } from "react";
import API from "@/services/api";
import RatingModal from "@/components/RatingModal";
import { Link } from "react-router-dom";
import { EMPLOYER_DASHBOARD_TABS } from "@/utils/taskStates";
import { getTaskActions } from "@/utils/taskActionEngine";
import TaskActionButtons from "@/components/tasks/TaskActionButtons";
import TaskTimeline from "@/components/tasks/TaskTimeline";
import TaskCard from "@/components/tasks/TaskCard";
import EscrowStatus from "@/components/tasks/EscrowStatus";

function EmployerDashboard() {
  const [dashboard, setDashboard] = useState({
    open: [],
    assigned: [],
    in_progress: [],
    submitted: [],
    revision_requested: [],
    approved: [],
    completed: [],
    cancelled: [],
    disputed: [],
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

      const data = res.data.dashboard || {};

      setDashboard({
        open: data.open || [],
        assigned: data.assigned || [],
        in_progress: data.in_progress || [],
        submitted: data.submitted || [],
        revision_requested: data.revision_requested || [],
        approved: data.approved || [],
        completed: data.completed || [],
        cancelled: data.cancelled || [],
        disputed: data.disputed || [],
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

  const menuItems = EMPLOYER_DASHBOARD_TABS;

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

    if (activeTab === "in_progress") {
      return (
        <span className="px-3 py-1 text-sm bg-blue-200 text-blue-900 rounded-full">
          Work In Progress
        </span>
      );
    }

    if (activeTab === "submitted") {
      return (
        <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
          Awaiting Review
        </span>
      );
    }

    if (activeTab === "revision_requested") {
      return (
        <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
          Revision Requested
        </span>
      );
    }

    if (activeTab === "approved") {
      return (
        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
          Approved
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

    if (activeTab === "cancelled") {
      return (
        <span className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-full">
          Cancelled
        </span>
      );
    }

    if (activeTab === "disputed") {
      return (
        <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
          Disputed
        </span>
      );
    }
  };

  const renderTask = (task) => (
    <TaskCard
      key={task._id}
      task={task}
      role="employer"
      badge={renderBadge(task)}
      onClick={() => toggleTask(task._id)}
      isExpanded={activeTab === "open" && expandedTask === task._id}
      onActionSuccess={(actionLabel) => {
        fetchDashboard();

        if (actionLabel === "Complete Task") {
          setRatingTaskId(task._id);
        }
      }}
      extraContent={applications.map((app) => (
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
    />
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
