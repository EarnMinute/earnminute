import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/admin/all");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/admin/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeTab);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Task Moderation</h1>

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          {["all", "open", "assigned", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-blue-900 text-white" : "bg-gray-200"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Title</th>
                <th>Employer</th>
                <th>Applications</th>
                <th>Freelancer</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="border-b">
                  <td className="py-3 font-medium">{task.title}</td>

                  <td>{task.employer?.name}</td>

                  <td>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-blue-600 hover:underline"
                    >
                      {task.applications?.length || 0}
                    </button>
                  </td>

                  <td>
                    {task.assignedFreelancer ? (
                      <Link
                        to={`/freelancer/profile/${task.assignedFreelancer._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {task.assignedFreelancer.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="capitalize">{task.status}</td>

                  <td className="text-green-600">৳ {task.budgetAmount}</td>

                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* APPLICATION MODAL */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6">
              <h2 className="text-lg font-bold mb-4">
                Applications for "{selectedTask.title}"
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {selectedTask.applications
                  ?.filter((app) => {
                    // Only show assigned freelancer for completed tasks
                    if (selectedTask.status === "completed") {
                      return app.status === "assigned";
                    }
                    return true;
                  })
                  .map((app) => {
                    let label = "";

                    if (selectedTask.status === "assigned") {
                      label =
                        app.status === "assigned" ? "ASSIGNED" : "REJECTED";
                    }

                    if (
                      selectedTask.status === "completed" &&
                      app.status === "assigned"
                    ) {
                      label = "COMPLETED";
                    }

                    return (
                      <div
                        key={app._id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <Link
                          to={`/freelancer/profile/${app.freelancer._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {app.freelancer.name}
                        </Link>

                        {label && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              label === "ASSIGNED"
                                ? "bg-green-100 text-green-700"
                                : label === "REJECTED"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {label}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminTasks;
