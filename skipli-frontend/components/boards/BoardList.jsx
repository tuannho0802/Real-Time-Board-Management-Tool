import { Link } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function BoardList({
  boards,
  onOpenCreateBoard,
  onEdit,
  onDelete,
}) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Boards
        </h2>
        <button
          onClick={onOpenCreateBoard}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          <PlusIcon className="w-4 h-4" />
          New Board
        </button>
      </div>

      {boards.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You don't have any boards yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Link
                    to={`/boards/${board.id}`}
                    className="block text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {board.name}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {board.description ||
                      "No description"}
                  </p>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <button
                    onClick={() =>
                      onEdit(board)
                    }
                    className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onDelete(board.id)
                    }
                    className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
