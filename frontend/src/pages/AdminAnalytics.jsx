import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../components/AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function AdminAnalytics() {
  const [chartData, setChartData] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalEmployers: 0,
    totalTasks: 0,
    totalApplications: 0,
    activeToday: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchCharts();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/analytics/admin-dashboard");

      setStats(res.data);
    } catch (error) {
      console.error("Stats error", error);
    }
  };

  const fetchCharts = async () => {
    try {
      const res = await API.get("/analytics/admin-charts");

      setChartData(res.data);
    } catch (error) {
      console.error("Charts error", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Platform Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Traffic, growth and marketplace performance.
          </p>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Freelancers" value={stats.totalFreelancers} />
          <StatCard label="Employers" value={stats.totalEmployers} />
          <StatCard label="Tasks" value={stats.totalTasks} />
          <StatCard label="Applications" value={stats.totalApplications} />
          <StatCard label="Active Today" value={stats.activeToday} />
        </div>

        {/* TRAFFIC CHART */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-lg font-semibold mb-6">Website Traffic</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="visits"
                stroke="#1e3a8a"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="logins"
                stroke="#16a34a"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#9333ea"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TASK CREATION CHART */}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">Tasks Created Per Day</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="tasks" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="text-2xl font-bold mt-1 text-blue-900">{value}</p>
    </div>
  );
}

export default AdminAnalytics;
