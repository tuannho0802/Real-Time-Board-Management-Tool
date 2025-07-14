import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/boards/DashboardLayout";
import FancyLoader from "../../components/FancyLoader/FancyLoader";
import CardList from "../../components/cards/CardList";
import CardModal from "../../components/cards/CardModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getBoardById } from "../../api/board";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../../api/card";

export default function BoardDetailPage() {
  const { id } = useParams(); // boardId
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] =
    useState("");

  const [isCardModalOpen, setIsCardModalOpen] =
    useState(false);
  const [modalMode, setModalMode] =
    useState("create");
  const [selectedCard, setSelectedCard] =
    useState(null);

  // fetch board and cards
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const boardRes = await getBoardById(id);
        const cardsRes = await getCards(id);
        setBoard(boardRes.data);
        setCards(cardsRes.data);
      } catch (err) {
        console.error(
          "Failed to fetch data",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreate = () => {
    setSelectedCard(null);
    setModalMode("create");
    setIsCardModalOpen(true);
  };

  const handleEdit = (card) => {
    setSelectedCard(card);
    setModalMode("edit");
    setIsCardModalOpen(true);
  };

  const handleDelete = async (cardId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this card?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCard(id, cardId);
      const cardsRes = await getCards(id);
      setCards(cardsRes.data);
    } catch (err) {
      console.error(
        "Failed to delete card",
        err
      );
    }
  };

  const handleCardSave = async (data) => {
    try {
      if (
        modalMode === "edit" &&
        selectedCard
      ) {
        await updateCard(
          id,
          selectedCard.id,
          data
        );
      } else {
        await createCard(id, data);
      }
      const cardsRes = await getCards(id);
      setCards(cardsRes.data);
      setIsCardModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      console.error("Failed to save card", err);
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <FancyLoader />
      ) : board ? (
        <div className="max-w-5xl mx-auto px-4 py-6 bg-white dark:bg-gray-800">
          {/* Board Title */}
          <div className="mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {board.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {board.description}
            </p>
          </div>

          {/* Card Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Cards
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto bg-white dark:bg-gray-800">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded w-full sm:w-64"
              />
              <button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                <PlusIcon className="w-4 h-4" />{" "}
                New Card
              </button>
            </div>
          </div>

          {/* Cards List */}
          <CardList
            cards={cards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchQuery={searchQuery}
          />

          {/* Modal */}
          <CardModal
            isOpen={isCardModalOpen}
            onClose={() => {
              setIsCardModalOpen(false);
              setSelectedCard(null);
            }}
            onSave={handleCardSave}
            initialData={selectedCard}
            mode={modalMode}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Board not found.
        </p>
      )}
    </DashboardLayout>
  );
}
