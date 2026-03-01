import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTask();
    checkIfApplied();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await API.get("/tasks");
      const found = res.data.find((t) => t._id === id);
      setTask(found);
    } catch (err) {
      console.error("Error loading task");
    }
  };

  const checkIfApplied = async () => {
    if (!user || user.user.role !== "freelancer") return;

    try {
      const res = await API.get("/applications/freelancer/dashboard");

      const allApplications = [
        ...res.data.applied,
        ...res.data.assigned,
        ...res.data.rejected,
      ];

      const exists = allApplications.find((app) => app.task._id === id);

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

  if (!task) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>

        <p className="text-green-600 font-semibold mb-4">
          ৳ {task.budgetAmount}
        </p>

        <p className="text-gray-700 mb-6">{task.description}</p>

        {message && (
          <p className="mb-4 text-blue-600 font-semibold">{message}</p>
        )}

        {user?.user?.role === "freelancer" && (
          <button
            onClick={handleApply}
            disabled={applied}
            className={`px-6 py-3 rounded text-white ${
              applied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {applied ? "Applied ✔" : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
