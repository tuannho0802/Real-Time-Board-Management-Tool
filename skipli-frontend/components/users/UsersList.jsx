import { useEffect, useState } from "react";
import axios from "axios";
import FancyLoader from "../FancyLoader/FancyLoader";

export default function UsersList({
  onSelectUser,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/users", {
        withCredentials: true,
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(
          "Error loading users",
          err
        );
        setError("Failed to load users.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FancyLoader />;

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500">
          No users found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Users
      </h2>

      <ul className="space-y-3">
        {users.map((user) => {
          const name = user.name || "Unnamed";
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <li
              key={user.id}
              onClick={() =>
                onSelectUser(user.id)
              }
              className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {name}
                </p>
                <p className="text-l text-gray-500">
                  {user.email}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
