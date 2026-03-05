import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Tasks", path: "/admin/tasks" },
    { name: "Applications", path: "/admin/applications" },
    { name: "Analytics", path: "/admin/analytics" },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <h2 className="text-xl font-bold text-blue-900 mb-8">Admin Panel</h2>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-blue-100 text-blue-900 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
