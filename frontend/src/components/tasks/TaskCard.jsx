import TaskActionButtons from "@/components/tasks/TaskActionButtons";
import TaskTimeline from "@/components/tasks/TaskTimeline";
import EscrowStatus from "./EscrowStatus";
import API from "@/services/api";

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
        className="p-4 sm:p-6 flex flex-col gap-3 cursor-pointer hover:bg-gray-50"
      >
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 className="font-semibold break-words text-base sm:text-lg">
            {task.title}
          </h3>

          <div className="self-start sm:self-auto">{badge}</div>
        </div>

        {/* BUDGET */}
        <p className="text-green-600 font-semibold text-sm sm:text-base">
          ৳ {task.budgetAmount}
        </p>

        {/* ESCROW */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Escrow:</span>
          <EscrowStatus status={task.escrowStatus} />

          {task.escrowStatus === "pending" && role === "employer" && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await API.patch(`/escrow/${task._id}/fund`);
                  onActionSuccess?.("escrow_funded");
                } catch (err) {
                  console.error("Funding failed", err);
                }
              }}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
            >
              Fund Escrow
            </button>
          )}
        </div>

        {/* EMPLOYER */}
        {role === "freelancer" && task.employer?.name && (
          <p className="text-sm text-gray-500">
            Employer: {task.employer.name}
          </p>
        )}
      </div>

      {/* EXPANDABLE */}
      {isExpanded && extraContent && (
        <div className="border-t bg-gray-50 p-4 sm:p-6 space-y-4">
          {extraContent}
        </div>
      )}

      {/* ACTIONS */}
      <div className="border-t p-4 sm:p-6">
        <TaskActionButtons
          task={task}
          userRole={role}
          onActionSuccess={onActionSuccess}
        />
      </div>

      {/* TIMELINE */}
      <div className="px-4 sm:px-6 pb-4">
        <TaskTimeline taskId={task._id} />
      </div>
    </div>
  );
}

export default TaskCard;
