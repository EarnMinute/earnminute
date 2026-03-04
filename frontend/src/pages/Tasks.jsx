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
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-12">
          <h1>Browse Tasks</h1>
          <p className="text-gray-500 mt-2">
            Find tasks that match your skills and start earning today.
          </p>
        </div>

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
