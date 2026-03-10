import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (skill) params.append("skill", skill);
    if (minBudget) params.append("minBudget", minBudget);
    if (maxBudget) params.append("maxBudget", maxBudget);

    return params.toString();
  };

  const fetchTasks = async () => {
    try {
      const query = buildQuery();
      const url = query ? `/tasks?${query}` : "/tasks";

      const res = await API.get(url);

      const data = res.data.data;

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to load tasks");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-12">
          <h1>Browse Tasks</h1>
          <p className="text-gray-500 mt-2">
            Find tasks that match your skills and start earning today.
          </p>
        </div>

        {/* SEARCH / FILTER */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-md p-6 mb-10 grid md:grid-cols-5 gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="Min Budget"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="Max Budget"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-800 transition"
          >
            Search
          </button>
        </form>

        {/* TASK LIST */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <p className="text-gray-500">No tasks available right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {/* TITLE */}
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {task.title}
                  </h3>

                  {/* BUDGET */}
                  <p className="text-green-600 font-semibold mb-3">
                    ৳ {task.budgetAmount}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                    {task.description?.slice(0, 100)}...
                  </p>

                  {/* SKILLS */}
                  {task.skills && task.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {task.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* BUTTON */}
                <Link
                  to={`/task/${task._id}`}
                  className="mt-auto inline-block bg-blue-900 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;
