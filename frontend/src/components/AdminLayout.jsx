import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout({ children }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
