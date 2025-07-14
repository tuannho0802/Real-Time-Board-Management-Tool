import { useState, useEffect } from "react";

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultStatus = "icebox",
  mode = "create",
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [status, setStatus] = useState(
    defaultStatus
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(
        initialData.description || ""
      );
      setStatus(
        initialData.status || defaultStatus
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
    }
  }, [initialData, defaultStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit"
            ? "Edit Task"
            : "New Task"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
          <select
            className="w-full border px-3 py-2 rounded"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="icebox">
              Icebox
            </option>
            <option value="backlog">
              Backlog
            </option>
            <option value="ongoing">
              Ongoing
            </option>
            <option value="review">
              Waiting for Review
            </option>
            <option value="done">Done</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
