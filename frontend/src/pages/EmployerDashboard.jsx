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

      // IMPORTANT LINE
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-blue-900 mb-6">My Tasks</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Open</p>
          <p className="text-2xl font-bold text-green-600">
            {dashboard.open.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-blue-600">
            {dashboard.completed.length}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b mb-8">
        {["open", "assigned", "completed"].map((tab) => (
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

      {/* OPEN TASKS */}
      {activeTab === "open" &&
        dashboard.open.map((task) => (
          <div key={task._id} className="bg-white rounded-xl shadow mb-6">
            <div
              onClick={() => toggleTask(task._id)}
              className="p-6 flex justify-between cursor-pointer"
            >
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-green-600 font-semibold">
                  ৳ {task.budgetAmount}
                </p>
              </div>

              <div className="text-blue-700 font-semibold">
                {task.applicationsCount} Applications
              </div>
            </div>

            {expandedTask === task._id && (
              <div className="border-t p-4 bg-gray-50 space-y-3">
                {applications.length === 0 ? (
                  <p className="text-sm text-gray-500">No applications yet.</p>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white p-4 rounded flex justify-between items-center shadow-sm"
                    >
                      <div>
                        <p className="font-semibold">{app.freelancer.name}</p>
                        <p className="text-sm text-gray-600">
                          Rating: {app.freelancer.ratingAverage || 0}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAssign(task._id, app._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
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

      {/* ASSIGNED TASKS */}
      {activeTab === "assigned" &&
        dashboard.assigned.map((task) => (
          <div
            key={task._id}
            className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-green-600 font-semibold">
                ৳ {task.budgetAmount}
              </p>
              <p className="text-sm text-gray-600">
                Assigned to: {task.assignedFreelancer?.name}
              </p>
            </div>

            <button
              onClick={() => handleComplete(task._id)}
              className="bg-blue-800 text-white px-5 py-2 rounded"
            >
              Mark as Completed
            </button>
          </div>
        ))}

      {/* COMPLETED TASKS */}
      {activeTab === "completed" &&
        dashboard.completed.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-green-600 font-semibold">
              ৳ {task.budgetAmount}
            </p>
            <p className="text-sm text-gray-600">
              Completed by: {task.assignedFreelancer?.name}
            </p>

            <span className="inline-block mt-2 px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
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
  );
}

export default EmployerDashboard;
