import { Link } from "react-router-dom";
import useAdminTasks from "@/hooks/admin/useAdminTasks";
import AdminTable from "@/components/admin/AdminTable";

function AdminTasks() {
  const {
    filteredTasks,
    isLoading,
    page,
    setPage,
    totalPages,
    activeTab,
    setActiveTab,
    selectedTask,
    setSelectedTask,
    deleteTask,
  } = useAdminTasks();

  if (isLoading) {
    return <p className="text-center mt-10">Loading tasks...</p>;
  }

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (task) => task.title,
    },

    {
      key: "employer",
      label: "Employer",
      render: (task) =>
        task.employer ? (
          <Link
            to={`/employer/profile/${task.employer._id}`}
            className="text-blue-600 hover:underline"
          >
            {task.employer.name}
          </Link>
        ) : (
          "-"
        ),
    },

    {
      key: "applications",
      label: "Applications",
      render: (task) => (
        <button
          onClick={() => setSelectedTask(task)}
          className="text-blue-600 hover:underline"
        >
          {task.applications?.length || 0}
        </button>
      ),
    },

    {
      key: "freelancer",
      label: "Freelancer",
      render: (task) =>
        task.assignedFreelancer ? (
          <Link
            to={`/freelancer/profile/${task.assignedFreelancer._id}`}
            className="text-blue-600 hover:underline"
          >
            {task.assignedFreelancer.name}
          </Link>
        ) : (
          "-"
        ),
    },

    {
      key: "status",
      label: "Status",
      render: (task) => task.status,
    },

    {
      key: "budgetAmount",
      label: "Budget",
      render: (task) => (
        <span className="text-green-600">৳ {task.budgetAmount}</span>
      ),
    },

    {
      key: "date",
      label: "Date",
      render: (task) => new Date(task.createdAt).toLocaleDateString(),
    },

    {
      key: "action",
      label: "Action",
      render: (task) => (
        <button
          onClick={() => deleteTask(task._id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Task Moderation</h1>

      {/* Tabs */}

      <div className="flex gap-4 mb-6">
        {["all", "open", "assigned", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={filteredTasks}
        emptyMessage="No tasks found"
      />

      {/* Pagination */}

      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Applications Modal */}

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4">
              Applications for "{selectedTask.title}"
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedTask.applications
                ?.filter((app) => {
                  if (selectedTask.status === "completed") {
                    return app.status === "assigned";
                  }

                  return true;
                })
                .map((app) => {
                  let label = "";

                  if (selectedTask.status === "assigned") {
                    label = app.status === "assigned" ? "ASSIGNED" : "REJECTED";
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
  );
}

export default AdminTasks;
