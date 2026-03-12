import { useAuth } from "@/context/AuthContext";

function AdminTopbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.user?.name}</span>

        <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-medium">
          Admin
        </div>
      </div>
    </div>
  );
}

export default AdminTopbar;
