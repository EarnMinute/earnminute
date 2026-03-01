import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PostTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    budgetType: "fixed",
    budgetAmount: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.budgetAmount) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/tasks", {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      });

      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">
          Post a New Task
        </h1>

        {error && <p className="mb-6 text-red-600 font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block mb-2 font-semibold">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-3"
              placeholder="Enter task title"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 font-semibold">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded p-3"
              placeholder="Describe your task"
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className="block mb-2 font-semibold">Required Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border rounded p-3"
              placeholder="Excel, Data Entry, Typing"
            />
          </div>

          {/* BUDGET */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Budget Type</label>
              <select
                name="budgetType"
                value={formData.budgetType}
                onChange={handleChange}
                className="w-full border rounded p-3"
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Budget Amount (৳) *
              </label>
              <input
                type="number"
                name="budgetAmount"
                value={formData.budgetAmount}
                onChange={handleChange}
                className="w-full border rounded p-3"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="block mb-2 font-semibold">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border rounded p-3"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
          >
            {loading ? "Posting..." : "Post Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostTask;
