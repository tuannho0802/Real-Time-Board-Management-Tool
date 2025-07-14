import { useEffect, useState } from "react";
import {
  useParams,
  Link,
} from "react-router-dom";
import { getCardById } from "../../api/card";
import DashboardLayout from "../../components/boards/DashboardLayout";
import FancyLoader from "../../components/FancyLoader/FancyLoader";

export default function CardDetailPage() {
  const { boardId, id } = useParams(); // cardId
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await getCardById(
          boardId,
          id
        );
        setCard(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch card",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [boardId, id]);

  return (
    <DashboardLayout>
      {loading ? (
        <FancyLoader />
      ) : card ? (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow break-words">
          <Link
            to={`/boards/${boardId}`}
            className="text-blue-500 underline text-sm mb-4 inline-block"
          >
            ← Back to Board
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            {card.name}
          </h1>
          <br />
          <p className="text-gray-600 text-2xl whitespace-pre-wrap">
            {card.description}
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Card not found.
        </p>
      )}
    </DashboardLayout>
  );
}
