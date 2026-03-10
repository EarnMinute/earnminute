import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const fetchAdminAnalytics = async () => {
    const res = await API.get("/analytics/admin-dashboard");
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminAnalytics,
  });

  const stats = data
    ? {
        totalUsers: data.totalUsers,
        totalFreelancers: data.totalFreelancers,
        totalEmployers: data.totalEmployers,
        totalTasks: data.totalTasks,
        totalApplications: data.totalApplications,
        activeToday: data.activeToday,
      }
    : {
        totalUsers: 0,
        totalFreelancers: 0,
        totalEmployers: 0,
        totalTasks: 0,
        totalApplications: 0,
        activeToday: 0,
      };

  const recentUsers = data?.recentUsers || [];
  const recentTasks = data?.recentTasks || [];

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-center mt-10">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Platform overview and marketplace statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            color="text-blue-900"
          />
          <StatCard
            label="Freelancers"
            value={stats.totalFreelancers}
            color="text-purple-600"
          />
          <StatCard
            label="Employers"
            value={stats.totalEmployers}
            color="text-green-600"
          />
          <StatCard
            label="Tasks"
            value={stats.totalTasks}
            color="text-orange-500"
          />
          <StatCard
            label="Applications"
            value={stats.totalApplications}
            color="text-blue-600"
          />
          <StatCard
            label="Active Today"
            value={stats.activeToday}
            color="text-green-500"
          />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Recent Users
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-3 font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Recent Tasks
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Title</th>
                <th>Employer</th>
                <th>Budget</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentTasks.map((task) => (
                <tr key={task._id} className="border-b">
                  <td className="py-3 font-medium">{task.title}</td>
                  <td>{task.employer?.name}</td>
                  <td className="text-green-600">৳ {task.budgetAmount}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default AdminDashboard;
