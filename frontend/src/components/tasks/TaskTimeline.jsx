import { useEffect, useState } from "react";
import API from "@/services/api";

const eventIcons = {
  task_posted: "📋",
  task_assigned: "👤",
  task_started: "🚀",
  task_submitted: "📤",
  revision_requested: "✏️",
  task_approved: "✅",
  task_completed: "🏆",
  task_cancelled: "❌",
  task_disputed: "⚠️",
};

function TaskTimeline({ taskId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTimeline();
  }, [taskId]);

  const fetchTimeline = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}/timeline`);
      setEvents(res.data.timeline || []);
    } catch (err) {
      console.error("Timeline load error");
    }
  };

  if (!events.length) {
    return (
      <div className="text-sm text-gray-500 mt-4">No timeline events yet.</div>
    );
  }

  return (
    <div className="mt-6 border-t pt-4 space-y-3">
      <h4 className="font-semibold text-sm text-gray-700 mb-2">
        Task Timeline
      </h4>

      {events.map((event) => (
        <div
          key={event._id}
          className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
        >
          <span className="text-lg">{eventIcons[event.type] || "📌"}</span>

          <div className="text-sm text-gray-700">
            <p>{event.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(event.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskTimeline;
