import useAdminFeedbacks from "@/hooks/admin/useAdminFeedbacks";
import AdminTable from "@/components/admin/AdminTable";

const typeLabels = {
  suggestion: "Suggestion",
  bug: "Bug Report",
  ui: "UI / Design",
  performance: "Performance",
  general: "General",
};

function AdminFeedbacks() {
  const { feedbacks, isLoading, markReviewed } = useAdminFeedbacks();

  if (isLoading) {
    return <p className="text-center mt-10">Loading feedback...</p>;
  }

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (f) => typeLabels[f.type] || f.type,
    },

    {
      key: "message",
      label: "Message",
      render: (f) => f.message,
    },

    {
      key: "user",
      label: "User",
      render: (f) => {
        const name = f.user?.name || f.name || "Anonymous";
        const email = f.user?.email || f.email;

        return (
          <div>
            <div className="font-medium">{name}</div>
            {email && <div className="text-sm text-gray-500">{email}</div>}
          </div>
        );
      },
    },

    {
      key: "date",
      label: "Date",
      render: (f) => new Date(f.createdAt).toLocaleDateString(),
    },

    {
      key: "status",
      label: "Status",
      render: (f) =>
        f.status === "new" ? (
          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-medium">
            New
          </span>
        ) : (
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
            Reviewed
          </span>
        ),
    },

    {
      key: "action",
      label: "",
      render: (f) =>
        f.status === "new" && (
          <button
            onClick={() => markReviewed(f._id)}
            className="text-blue-600 hover:underline"
          >
            Mark Reviewed
          </button>
        ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">User Feedback</h1>

      <AdminTable
        columns={columns}
        data={feedbacks}
        emptyMessage="No feedback available"
      />
    </div>
  );
}

export default AdminFeedbacks;
