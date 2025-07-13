import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardById } from "../../api/board";
import DashboardLayout from "../boards/DashboardLayout";
import FancyLoader from "../FancyLoader/FancyLoader";

export default function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBoardById(id);
        setBoard(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch board",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <DashboardLayout>
      {loading ? (
        <FancyLoader />
      ) : board ? (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-2">
            {board.name}
          </h1>
          <p className="text-gray-600">
            {board.description}
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Board not found.
        </p>
      )}
    </DashboardLayout>
  );
}
