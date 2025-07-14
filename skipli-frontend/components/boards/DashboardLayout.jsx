import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function DashboardLayout({
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin", { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard")
      return "Dashboard";
    if (
      path.startsWith("/boards/") &&
      !path.includes("/cards/")
    )
      return "Board Details";
    if (path.includes("/cards/"))
      return "Card Details";

    if (path.includes("/users")) return "Users";

    return "Real-Time Board Management Tool";
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">
          Real-Time Board Management Tool
        </h2>
        <nav className="flex flex-col gap-4 flex-1">
          <Link
            to="/dashboard"
            className="hover:text-gray-300"
          >
            Dashboard
          </Link>
          <Link
            to="/users"
            className="hover:text-gray-300"
          >
            Users
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {getPageTitle()}
          </h1>
          <div className="text-sm text-gray-600">
            {user?.email}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
