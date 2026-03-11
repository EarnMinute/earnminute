import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function AdminUsers() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    const res = await API.get(`/users/admin/all?page=${page}`);

    const data = res.data;

    if (Array.isArray(data)) {
      setTotalPages(1);
      return data;
    }

    if (data?.users) {
      setTotalPages(data.totalPages || 1);
      return data.users;
    }

    return [];
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers", page],
    queryFn: fetchUsers,
  });

  const changeRole = async (id, role) => {
    try {
      await API.patch(`/users/admin/role/${id}`, { role });

      queryClient.invalidateQueries(["adminUsers"]);
    } catch (error) {
      console.error("Role update failed", error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await API.delete(`/users/admin/${id}`);

      queryClient.invalidateQueries(["adminUsers"]);
    } catch (error) {
      console.error("User delete failed", error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        {" "}
        <p className="text-center mt-10">Loading users...</p>{" "}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <h1 className="text-2xl font-bold mb-8">User Management</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-3 font-medium">{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
