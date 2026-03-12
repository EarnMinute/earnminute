import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
