import { useEffect, useState } from "react";
import API from "@/services/api";

const eventIcons = {
  task_posted: { icon: "📋", color: "text-blue-600" },
  user_joined: { icon: "👤", color: "text-purple-600" },
  task_applied: { icon: "⚡", color: "text-green-600" },
  task_completed: { icon: "🏆", color: "text-orange-500" },
};

function buildMessage(activity) {
  switch (activity.type) {
    case "task_posted":
      return `${activity.userName} posted a new task: "${activity.taskTitle}"`;

    case "user_joined":
      return `${activity.userName} joined EarnMinute`;

    case "task_applied":
      return `${activity.userName} applied to a task`;

    case "task_completed":
      return `${activity.userName} completed a task`;

    default:
      return "Marketplace activity";
  }
}

function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const res = await API.get("/activities");

      setActivities(res.data);
    } catch (error) {
      console.error("Failed to load activity feed");
    }
  };

  useEffect(() => {
    fetchActivities();

    const interval = setInterval(fetchActivities, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Live Marketplace Activity
      </h3>

      <div className="space-y-3">
        {activities.map((item) => {
          const event = eventIcons[item.type] || {
            icon: "📢",
            color: "text-gray-500",
          };

          return (
            <div
              key={item._id}
              className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
            >
              <span className={`text-lg ${event.color}`}>{event.icon}</span>

              <p className="text-sm text-gray-700">{buildMessage(item)}</p>
            </div>
          );
        })}

        {activities.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
}

export default LiveActivityFeed;
