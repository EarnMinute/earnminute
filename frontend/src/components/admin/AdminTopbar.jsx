import { useAuth } from "@/context/AuthContext";

function AdminTopbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-xl bg-gray-100 px-2 py-1 rounded"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          {user?.user?.name}
        </span>

        <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-medium">
          Admin
        </div>
      </div>
    </div>
  );
}

export default AdminTopbar;
