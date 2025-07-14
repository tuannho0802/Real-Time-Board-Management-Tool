import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function CardList({
  cards,
  onEdit,
  onDelete,
  searchQuery,
}) {
  const filteredCards = cards.filter((card) =>
    card.name
      .toLowerCase()
      .includes(
        searchQuery?.toLowerCase() || ""
      )
  );

  if (!filteredCards.length) {
    return (
      <p className="text-gray-500 text-center mt-4">
        No cards in this board yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2">
      {filteredCards.map((card) => (
        <div
          key={card.id}
          className="p-4 bg-white dark:bg-gray-300 shadow rounded border hover:shadow-md  relative"
        >
          <Link to={`cards/${card.id}`}>
            <h3 className="text-lg font-semibold hover:underline">
              {card.name}
            </h3>
          </Link>
          {card.description && (
            <p className="text-sm text-gray-600 mt-1">
              {card.description.length > 30
                ? `${card.description.slice(
                    0,
                    30
                  )}...`
                : card.description}
            </p>
          )}

          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => onEdit(card)}
              className="text-blue-500 hover:underline text-sm flex items-center gap-1"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="text-red-500 hover:underline text-sm flex items-center gap-1"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
