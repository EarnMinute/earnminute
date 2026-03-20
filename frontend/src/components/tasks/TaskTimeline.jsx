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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTimeline();
  }, [taskId]);

  const fetchTimeline = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}/timeline`);
      setEvents(res.data.timeline || []);
    } catch {
      console.error("Timeline load error");
    }
  };

  return (
    <div className="mt-4">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer border rounded-lg px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200"
      >
        Task Timeline {open ? "▲" : "▼"}
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {!events.length && (
            <p className="text-sm text-gray-500">No timeline events yet.</p>
          )}

          {events.map((event) => (
            <div
              key={event._id}
              className="flex gap-2 sm:gap-3 bg-white border rounded-lg p-3"
            >
              <span className="text-sm sm:text-lg">
                {eventIcons[event.type] || "📌"}
              </span>

              <div className="text-sm text-gray-700 break-words">
                <p>{event.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskTimeline;
