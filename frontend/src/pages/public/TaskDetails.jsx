import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { startConversation } from "../../services/chatService";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
    checkIfApplied();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data.task || null);
    } catch (err) {
      console.error("Error loading task:", err);
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!user || user.user.role !== "freelancer") return;

    try {
      const res = await API.get("/applications/freelancer/dashboard");

      const allApplications = [
        ...(res.data.applied || []),
        ...(res.data.assigned || []),
        ...(res.data.rejected || []),
      ];

      const exists = allApplications.find((app) => app.task?._id === id);

      if (exists) setApplied(true);
    } catch (err) {
      console.error("Error checking application");
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.user.role !== "freelancer") {
      setMessage("Only freelancers can apply.");
      return;
    }

    try {
      await API.post(`/applications/${id}`);
      setApplied(true);
      setMessage("Applied successfully 🔥");
    } catch (err) {
      setMessage(err.response?.data?.message || "Application failed");
    }
  };

  const handleMessage = async () => {
    try {
      const freelancerId = user?.user?._id;

      const conversation = await startConversation(id, freelancerId);

      navigate("/messages", {
        state: { conversationId: conversation._id },
      });
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        {" "}
        <p className="text-gray-500">Loading task details...</p>{" "}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        {" "}
        <p className="text-gray-500">Task not found.</p>{" "}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      {" "}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        {" "}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-8">
          {" "}
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            {task.title}{" "}
          </h1>
          <div className="mb-6">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
              ৳ {task.budgetAmount}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>
          {message && (
            <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-sm">
              {message}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 h-fit sticky top-28">
          <h2 className="text-lg font-semibold text-blue-900 mb-6">
            Task Summary
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Budget</span>
              <span className="font-medium">৳ {task.budgetAmount}</span>
            </div>

            {task.deadline && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deadline</span>
                <span className="font-medium">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            )}

            {task.skills && task.skills.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm mb-2">Required Skills</p>

                <div className="flex flex-wrap gap-2">
                  {task.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user?.user?.role === "freelancer" && (
            <div className="space-y-3">
              <button
                onClick={handleApply}
                disabled={applied}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  applied
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {applied ? "Applied ✔" : "Apply Now"}
              </button>

              {applied && (
                <button
                  onClick={handleMessage}
                  className="w-full py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Message Employer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
