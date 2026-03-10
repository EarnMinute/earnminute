import { useQuery } from "@tanstack/react-query";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
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
  const fetchCharts = async () => {
    const res = await API.get("/analytics/admin-charts");
    return res.data;
  };

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["adminCharts"],
    queryFn: fetchCharts,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-center mt-10">Loading analytics...</p>
      </AdminLayout>
    );
  }

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

export default AdminAnalytics;
