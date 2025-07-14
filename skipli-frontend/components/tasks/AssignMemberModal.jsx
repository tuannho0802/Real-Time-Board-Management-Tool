import { useState } from "react";

export default function AssignMemberModal({
  isOpen,
  onClose,
  onAssign,
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onAssign(email);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">
          Assign Member
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Enter member email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
