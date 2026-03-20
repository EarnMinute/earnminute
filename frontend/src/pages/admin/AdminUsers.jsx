import { Link } from "react-router-dom";
import AdminTable from "@/components/admin/AdminTable";
import useAdminUsers from "@/hooks/admin/useAdminUsers";

function AdminUsers() {
  const {
    users,
    isLoading,
    page,
    setPage,
    totalPages,
    changeRole,
    deleteUser,
  } = useAdminUsers();

  if (isLoading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>

      {/* ================= MOBILE CARDS ================= */}
      <div className="block sm:hidden space-y-3">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-lg p-3 shadow-sm"
            >
              {/* NAME */}
              <div className="font-medium">
                {user.role === "freelancer" ? (
                  <Link
                    to={`/freelancer/profile/${user._id}`}
                    className="text-blue-600"
                  >
                    {user.name}
                  </Link>
                ) : user.role === "employer" ? (
                  <Link
                    to={`/employer/profile/${user._id}`}
                    className="text-blue-600"
                  >
                    {user.name}
                  </Link>
                ) : (
                  user.name
                )}
              </div>

              {/* EMAIL */}
              <p className="text-sm text-gray-500">{user.email}</p>

              {/* ROLE + DATE */}
              <div className="flex justify-between items-center mt-2 text-xs">
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="border rounded px-2 py-1 text-xs"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>

                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>

              {/* ACTION */}
              <button
                onClick={() => deleteUser(user._id)}
                className="mt-2 text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block">
        <AdminTable
          columns={[
            {
              key: "name",
              label: "Name",
              render: (user) => {
                if (user.role === "freelancer") {
                  return (
                    <Link
                      to={`/freelancer/profile/${user._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.name}
                    </Link>
                  );
                }

                if (user.role === "employer") {
                  return (
                    <Link
                      to={`/employer/profile/${user._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.name}
                    </Link>
                  );
                }

                return user.name;
              },
            },
            { key: "email", label: "Email" },
            {
              key: "role",
              label: "Role",
              render: (user) => (
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
              ),
            },
            {
              key: "createdAt",
              label: "Joined",
              render: (user) => new Date(user.createdAt).toLocaleDateString(),
            },
            {
              key: "actions",
              label: "Actions",
              render: (user) => (
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              ),
            },
          ]}
          data={users}
          emptyMessage="No users found"
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
    </div>
  );
}

export default AdminUsers;
