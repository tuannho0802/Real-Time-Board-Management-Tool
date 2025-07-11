import { useEffect, useState } from "react";
import { getBoards } from "../api/board";

export default function BoardList() {
  const [boards, setBoards] = useState([]);

  // show boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await getBoards();
        setBoards(res.data);
      } catch (err) {
        console.error(
          "Failed to load boards",
          err
        );
      }
    };
    fetchBoards();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Your Boards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            className="p-4 border rounded shadow bg-white hover:shadow-md"
          >
            <h3 className="text-lg font-medium">
              {board.name}
            </h3>
            <p className="text-sm text-gray-500">
              {board.description}
            </p>
          </div>
        ))}
        {/* If data is empty show this */}
        {boards.length === 0 && (
          <p className="text-gray-500">
            No boards yet.
          </p>
        )}
      </div>
    </div>
  );
}
