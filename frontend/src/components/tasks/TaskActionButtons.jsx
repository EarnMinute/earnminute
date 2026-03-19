import { getTaskActions } from "@/utils/taskActionEngine";

function TaskActionButtons({ task, userRole, onActionSuccess }) {
  const actions = getTaskActions(task, userRole);

  const handleAction = async (actionFn, label) => {
    try {
      await actionFn();

      if (onActionSuccess) {
        onActionSuccess(label);
      }
    } catch (err) {
      console.error("Action failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleAction(action.action, action.label)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default TaskActionButtons;
