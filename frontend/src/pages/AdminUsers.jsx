import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/admin/all");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await API.patch(`/users/admin/role/${id}`, { role });
      fetchUsers();
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
      fetchUsers();
    } catch (error) {
      console.error("User delete failed", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
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
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
