import TaskActionButtons from "@/components/tasks/TaskActionButtons";
import TaskTimeline from "@/components/tasks/TaskTimeline";
import EscrowStatus from "./EscrowStatus";

function TaskCard({
  task,
  role,
  badge,
  onActionSuccess,
  onClick,
  isExpanded,
  extraContent,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      {/* HEADER */}
      <div
        onClick={onClick}
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50"
      >
        <div>
          <div>
            <h3 className="font-semibold">{task.title}</h3>

            <p className="text-green-600 font-semibold mt-1">
              ৳ {task.budgetAmount}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Escrow:</span>
              <EscrowStatus status={task.escrowStatus} />
            </div>
          </div>

          {role === "freelancer" && task.employer?.name && (
            <p className="text-sm text-gray-500 mt-1">
              Employer: {task.employer.name}
            </p>
          )}
        </div>

        {badge}
      </div>

      {/* EXPANDABLE CONTENT */}
      {isExpanded && extraContent && (
        <div className="border-t bg-gray-50 p-6 space-y-4">{extraContent}</div>
      )}

      {/* ACTIONS */}
      <div className="border-t p-6">
        <TaskActionButtons
          task={task}
          userRole={role}
          onActionSuccess={onActionSuccess}
        />
      </div>

      {/* TIMELINE */}
      <div className="px-6 pb-4">
        <TaskTimeline taskId={task._id} />
      </div>
    </div>
  );
}

export default TaskCard;
