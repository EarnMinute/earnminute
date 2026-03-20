import useAdminDashboard from "@/hooks/admin/useAdminDashboard";

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

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
      <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Platform overview and marketplace statistics.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
        <StatCard
          label="Users"
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
          label="Active"
          value={stats.activeToday}
          color="text-green-500"
        />
      </div>

      {/* RECENT USERS */}
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          Recent Users
        </h2>

        {/* MOBILE CARDS */}
        <div className="block sm:hidden space-y-3">
          {recentUsers.map((user) => (
            <div key={user._id} className="border rounded-lg p-3 bg-gray-50">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex justify-between mt-2 text-xs">
                <span className="capitalize">{user.role}</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block">
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
      </div>

      {/* RECENT TASKS */}
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          Recent Tasks
        </h2>

        {/* MOBILE CARDS */}
        <div className="block sm:hidden space-y-3">
          {recentTasks.map((task) => (
            <div key={task._id} className="border rounded-lg p-3 bg-gray-50">
              <p className="font-medium break-words">{task.title}</p>

              <p className="text-sm text-gray-500">
                Employer: {task.employer?.name}
              </p>

              <div className="flex justify-between mt-2 text-xs">
                <span className="text-green-600 font-medium">
                  ৳ {task.budgetAmount}
                </span>

                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block">
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
    </div>
  );
}

/* ===============================
   STAT CARD (POLISHED)
================================ */
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-3 sm:p-5">
      <p className="text-[11px] sm:text-sm text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className={`text-lg sm:text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default AdminDashboard;
