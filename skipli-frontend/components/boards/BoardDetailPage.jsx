import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/boards/DashboardLayout";
import FancyLoader from "../../components/FancyLoader/FancyLoader";
import CardList from "../../components/cards/CardList";
import CardModal from "../../components/cards/CardModal";
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

  // fetch data
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
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-2">
            {board.name}
          </h1>
          <p className="text-gray-600 mb-6">
            {board.description}
          </p>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Cards
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="border px-3 py-2 rounded w-full md:w-64"
              />
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + New Card
              </button>
            </div>
          </div>

          <CardList
            cards={cards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchQuery={searchQuery}
          />

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
