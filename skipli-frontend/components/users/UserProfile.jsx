import { useEffect, useState } from "react";
import axios from "axios";
import FancyLoader from "../FancyLoader/FancyLoader";

export default function UserProfile({
  userId,
  onBack,
}) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/users/${userId}`,
        { withCredentials: true }
      )
      .then((res) => {
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
        });
      })
      .catch((err) => {
        console.error(
          "Error loading user",
          err
        );
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await axios.put(
        `http://localhost:5000/users/${userId}`,
        form,
        {
          withCredentials: true,
        }
      );
      setSuccess(true);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FancyLoader />;
  console.log("User loaded:", user);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-md max-w-md mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-500 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Edit User
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {success && (
            <span className="text-green-600 text-sm">
              Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
