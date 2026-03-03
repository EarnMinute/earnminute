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
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1>Post a New Task</h1>
          <p className="text-gray-500 mt-2">
            Provide clear details to attract the right freelancers.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow-md p-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* TASK DETAILS SECTION */}
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-6">
                Task Details
              </h2>

              <div className="space-y-6">
                {/* TITLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your task clearly..."
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
                  />
                </div>

                {/* SKILLS */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Required Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Excel, Data Entry, Typing"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Separate skills with commas.
                  </p>
                </div>
              </div>
            </div>

            {/* BUDGET SECTION */}
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-6">
                Budget Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* BUDGET TYPE */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Budget Type
                  </label>
                  <select
                    name="budgetType"
                    value={formData.budgetType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition bg-white"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>

                {/* BUDGET AMOUNT */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Budget Amount (৳) *
                  </label>
                  <input
                    type="number"
                    name="budgetAmount"
                    value={formData.budgetAmount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* DEADLINE */}
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-6">
                Timeline
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition shadow-md disabled:opacity-60"
              >
                {loading ? "Posting Task..." : "Post Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostTask;
