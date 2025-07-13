import { Link } from "react-router-dom";

export default function BoardList({
  boards,
  onOpenCreateBoard,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Your Boards
        </h2>
        <button
          onClick={onOpenCreateBoard}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Board
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.length > 0 ? (
          boards.map((board) => (
            <div
              key={board.id}
              className="p-4 border rounded shadow bg-white hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/boards/${board.id}`}
                  >
                    <h3 className="text-lg font-medium hover:underline">
                      {board.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {board.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() =>
                      onEdit(board)
                    }
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onDelete(board.id)
                    }
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No boards yet.
          </p>
        )}
      </div>
    </div>
  );
}
