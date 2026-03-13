import {
  getAvailableTaskActions,
  TASK_ACTIONS,
} from "@/utils/taskActionEngine";
import API from "@/services/api";

function TaskActionButtons({ task, userRole, onActionSuccess }) {
  const actions = getAvailableTaskActions(task, userRole);

  const handleStart = async () => {
    await API.patch(`/tasks/${task._id}/start`);
    onActionSuccess();
  };

  const handleSubmit = async () => {
    await API.patch(`/tasks/${task._id}/submit`);
    onActionSuccess();
  };

  const handleResubmit = async () => {
    await API.patch(`/tasks/${task._id}/submit`);
    onActionSuccess();
  };

  const handleApprove = async () => {
    await API.patch(`/tasks/${task._id}/approve`);
    onActionSuccess();
  };

  const handleRevision = async () => {
    await API.patch(`/tasks/${task._id}/revision`);
    onActionSuccess();
  };

  const handleComplete = async () => {
    await API.patch(`/tasks/${task._id}/complete`);
    onActionSuccess();
  };

  const handleCancel = async () => {
    await API.patch(`/tasks/${task._id}/cancel`);
    onActionSuccess();
  };

  const handleDispute = async () => {
    await API.patch(`/tasks/${task._id}/dispute`);
    onActionSuccess();
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {actions.includes(TASK_ACTIONS.START_TASK) && (
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Task
        </button>
      )}

      {actions.includes(TASK_ACTIONS.SUBMIT_WORK) && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Work
        </button>
      )}

      {actions.includes(TASK_ACTIONS.RESUBMIT_WORK) && (
        <button
          onClick={handleResubmit}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Resubmit Work
        </button>
      )}

      {actions.includes(TASK_ACTIONS.APPROVE_WORK) && (
        <button
          onClick={handleApprove}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Approve Work
        </button>
      )}

      {actions.includes(TASK_ACTIONS.REQUEST_REVISION) && (
        <button
          onClick={handleRevision}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Request Revision
        </button>
      )}

      {actions.includes(TASK_ACTIONS.COMPLETE_TASK) && (
        <button
          onClick={handleComplete}
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Complete Task
        </button>
      )}

      {actions.includes(TASK_ACTIONS.CANCEL_TASK) && (
        <button
          onClick={handleCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel Task
        </button>
      )}

      {actions.includes(TASK_ACTIONS.RAISE_DISPUTE) && (
        <button
          onClick={handleDispute}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Raise Dispute
        </button>
      )}
    </div>
  );
}

export default TaskActionButtons;
