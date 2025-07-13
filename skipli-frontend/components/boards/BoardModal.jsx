import { useEffect, useState } from "react";

export default function BoardModal({
  isOpen,
  onClose,
  onSave,
  mode = "create",
  initialData = null,
  warningMessage = "",
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description:
          initialData.description || "",
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all">
      <div className="bg-white p-6 rounded w-[90%] max-w-md shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-2">
          {mode === "edit"
            ? "Edit Board"
            : "Create New Board"}
        </h2>
        {warningMessage && (
          <p className="text-red-500 text-sm mb-2">
            {warningMessage}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Board name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {mode === "edit"
                ? "Save Changes"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
