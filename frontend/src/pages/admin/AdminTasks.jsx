import { Link } from "react-router-dom";
import useAdminTasks from "@/hooks/admin/useAdminTasks";
import AdminTable from "@/components/admin/AdminTable";
import API from "@/services/api";

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

  const handleFundEscrow = async (taskId) => {
    try {
      await API.patch(`/escrow/${taskId}/fund`);
      alert("Escrow funded successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fund escrow");
    }
  };

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
        <div className="flex gap-2">
          <button
            onClick={() => deleteTask(task._id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>

          {task.status === "assigned" && task.escrowStatus !== "funded" && (
            <button
              onClick={() => handleFundEscrow(task._id)}
              className="text-green-600 hover:text-green-800"
            >
              Fund
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Task Moderation</h1>

      {/* ================= TABS ================= */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {["all", "open", "assigned", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base ${
              activeTab === tab ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="block sm:hidden space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border rounded-lg p-3 shadow-sm"
            >
              <p className="font-medium break-words">{task.title}</p>

              <p className="text-sm text-gray-500">
                Employer: {task.employer?.name || "-"}
              </p>

              <p className="text-sm">
                Freelancer: {task.assignedFreelancer?.name || "-"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 font-medium">
                  ৳ {task.budgetAmount}
                </span>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {task.status}
                </span>
              </div>

              <button
                onClick={() => setSelectedTask(task)}
                className="text-blue-600 text-sm mt-2"
              >
                Applications ({task.applications?.length || 0})
              </button>

              <div className="flex gap-3 mt-2 text-sm">
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500"
                >
                  Delete
                </button>

                {task.status === "assigned" &&
                  task.escrowStatus !== "funded" && (
                    <button
                      onClick={() => handleFundEscrow(task._id)}
                      className="text-green-600"
                    >
                      Fund
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block">
        <AdminTable
          columns={columns}
          data={filteredTasks}
          emptyMessage="No tasks found"
        />
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-2 sm:px-4 bg-gray-200 rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm sm:text-base font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-2 sm:px-4 bg-gray-200 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* ================= APPLICATION MODAL ================= */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4">Applications</h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedTask.applications
                ?.filter((app) => {
                  if (selectedTask.status === "completed") {
                    return app.status === "assigned";
                  }
                  return true;
                })
                .map((app) => (
                  <div
                    key={app._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <Link
                      to={`/freelancer/profile/${app.freelancer._id}`}
                      className="text-blue-600"
                    >
                      {app.freelancer.name}
                    </Link>

                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {app.status}
                    </span>
                  </div>
                ))}
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
