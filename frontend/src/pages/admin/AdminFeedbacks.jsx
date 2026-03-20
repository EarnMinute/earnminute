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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">User Feedback</h1>

      {/* ================= MOBILE CARDS ================= */}
      <div className="block sm:hidden space-y-3">
        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedback available</p>
        ) : (
          feedbacks.map((f) => {
            const name = f.user?.name || f.name || "Anonymous";
            const email = f.user?.email || f.email;

            return (
              <div
                key={f._id}
                className="bg-white border rounded-lg p-3 shadow-sm"
              >
                {/* TYPE */}
                <p className="text-xs text-gray-500 uppercase">
                  {typeLabels[f.type] || f.type}
                </p>

                {/* MESSAGE */}
                <p className="mt-1 text-sm break-words">{f.message}</p>

                {/* USER */}
                <div className="mt-2 text-sm">
                  <p className="font-medium">{name}</p>
                  {email && <p className="text-gray-500 text-xs">{email}</p>}
                </div>

                {/* STATUS + DATE */}
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span>{new Date(f.createdAt).toLocaleDateString()}</span>

                  {f.status === "new" ? (
                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium">
                      New
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                      Reviewed
                    </span>
                  )}
                </div>

                {/* ACTION */}
                {f.status === "new" && (
                  <button
                    onClick={() => markReviewed(f._id)}
                    className="mt-2 text-blue-600 text-sm"
                  >
                    Mark Reviewed
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block">
        <AdminTable
          columns={[
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
                    {email && (
                      <div className="text-sm text-gray-500">{email}</div>
                    )}
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
          ]}
          data={feedbacks}
          emptyMessage="No feedback available"
        />
      </div>
    </div>
  );
}

export default AdminFeedbacks;
