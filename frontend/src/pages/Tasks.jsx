import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">
        All Available Tasks
      </h1>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-xl shadow border"
            >
              <h3 className="font-semibold text-lg mb-2 text-blue-900">
                {task.title}
              </h3>

              <p className="text-green-600 font-semibold mb-2">
                ৳ {task.budgetAmount}
              </p>

              <p className="text-gray-500 text-sm mb-4">
                {task.description?.slice(0, 80)}...
              </p>

              <Link
                to={`/task/${task._id}`}
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
