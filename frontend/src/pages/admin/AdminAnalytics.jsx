import useAdminAnalytics from "@/hooks/admin/useAdminAnalytics";
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
import { useEffect, useState } from "react";

function AdminAnalytics() {
  const { chartData, isLoading } = useAdminAnalytics();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isLoading) {
    return <p className="text-center mt-10">Loading analytics...</p>;
  }

  // Reduce label density for mobile
  const getTickFormatter = (value, index) => {
    if (!isMobile) return value;
    return index % 3 === 0 ? value : "";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Platform Analytics
        </h1>

        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Traffic, growth and marketplace performance.
        </p>
      </div>

      {/* TRAFFIC CHART */}
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Website Traffic
        </h2>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={getTickFormatter}
              angle={isMobile ? -30 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
            />

            <YAxis width={40} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="visits"
              stroke="#1e3a8a"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="logins"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="registrations"
              stroke="#9333ea"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TASK CREATION */}
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Tasks Created Per Day
        </h2>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={getTickFormatter}
              angle={isMobile ? -30 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
            />

            <YAxis width={40} />

            <Tooltip />

            <Bar dataKey="tasks" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminAnalytics;
