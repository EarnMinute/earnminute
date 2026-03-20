import { getTaskActions } from "@/utils/taskActionEngine";

function TaskActionButtons({ task, userRole, onActionSuccess }) {
  const actions = getTaskActions(task, userRole);

  const handleAction = async (actionFn, label) => {
    try {
      await actionFn();
      onActionSuccess?.(label);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleAction(action.action, action.label)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default TaskActionButtons;
