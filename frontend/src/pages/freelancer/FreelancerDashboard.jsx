import { useEffect, useState } from "react";
import API from "@/services/api";
import { Link } from "react-router-dom";
import { FREELANCER_DASHBOARD_TABS } from "@/utils/taskStates";
import TaskActionButtons from "@/components/tasks/TaskActionButtons";
import TaskTimeline from "@/components/tasks/TaskTimeline";

function FreelancerDashboard() {
  const [dashboard, setDashboard] = useState({
    applied: [],
    assigned: [],
    in_progress: [],
    submitted: [],
    revision_requested: [],
    approved: [],
    completed: [],
    cancelled: [],
    disputed: [],
    rejected: [],
  });

  const [activeTab, setActiveTab] = useState("applied");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/applications/freelancer/dashboard");

      setDashboard({
        applied: res.data.applied || [],
        assigned: res.data.assigned || [],
        in_progress: res.data.in_progress || [],
        submitted: res.data.submitted || [],
        revision_requested: res.data.revision_requested || [],
        approved: res.data.approved || [],
        completed: res.data.completed || [],
        cancelled: res.data.cancelled || [],
        disputed: res.data.disputed || [],
        rejected: res.data.rejected || [],
      });
    } catch (error) {
      console.error("Freelancer dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = FREELANCER_DASHBOARD_TABS;

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
          <h3 className="font-semibold">
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

        <div className="mt-3">
          <TaskActionButtons
            task={app.task}
            userRole="freelancer"
            onActionSuccess={fetchDashboard}
          />
        </div>
        <TaskTimeline taskId={app.task._id} />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r p-6">
        <h2 className="text-lg font-semibold mb-6">Freelancer</h2>

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
        <h1 className="text-2xl font-bold mb-6">Freelancer Dashboard</h1>

        {loading && (
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        )}

        {!loading && (
          <>
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

            {activeTab === "in_progress" &&
              renderTasks(
                dashboard.in_progress,
                "bg-blue-100 text-blue-700",
                "In Progress",
              )}

            {activeTab === "submitted" &&
              renderTasks(
                dashboard.submitted,
                "bg-yellow-100 text-yellow-700",
                "Submitted",
              )}

            {activeTab === "revision_requested" &&
              renderTasks(
                dashboard.revision_requested,
                "bg-orange-100 text-orange-700",
                "Revision Requested",
              )}

            {activeTab === "approved" &&
              renderTasks(
                dashboard.approved,
                "bg-green-200 text-green-800",
                "Approved",
              )}

            {activeTab === "cancelled" &&
              renderTasks(
                dashboard.cancelled,
                "bg-gray-200 text-gray-700",
                "Cancelled",
              )}

            {activeTab === "disputed" &&
              renderTasks(
                dashboard.disputed,
                "bg-red-100 text-red-700",
                "Disputed",
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
          </>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/tasks"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-700"
          >
            Browse New Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
