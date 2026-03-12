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

  const columns = [
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
  ];

  if (isLoading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">User Management</h1>

      <AdminTable
        columns={columns}
        data={users}
        emptyMessage="No users found"
      />

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
    </div>
  );
}

export default AdminUsers;
