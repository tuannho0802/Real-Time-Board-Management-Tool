import { useEffect, useState } from "react";
import DashboardLayout from "../components/boards/DashboardLayout";
import BoardList from "../components/boards/BoardList";
import BoardModal from "../components/boards/BoardModal";
import FancyLoader from "../components/FancyLoader/FancyLoader";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../api/board";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] =
    useState(false);
  const [modalMode, setModalMode] =
    useState("create");
  const [selectedBoard, setSelectedBoard] =
    useState(null);
  const [warningMessage, setWarningMessage] =
    useState("");

  // fetch boards
  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await getBoards();
      setBoards(res.data);
    } catch (err) {
      console.error(
        "Failed to load boards",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // open create
  const handleCreateClick = () => {
    setSelectedBoard(null);
    setModalMode("create");
    setOpenModal(true);
    setWarningMessage("");
  };

  // open edit
  const handleEditClick = (board) => {
    setSelectedBoard(board);
    setModalMode("edit");
    setOpenModal(true);
    setWarningMessage("");
  };

  // delete function
  const handleDeleteClick = async (boardId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this board?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBoard(boardId);
      fetchBoards();
    } catch (err) {
      console.error(
        "Failed to delete board",
        err
      );
    }
  };

  // save function
  const handleSave = async (data) => {
    const duplicate = boards.find(
      (b) =>
        b.name.trim().toLowerCase() ===
          data.name.trim().toLowerCase() &&
        (!selectedBoard ||
          b.id !== selectedBoard.id)
    );

    if (duplicate) {
      setWarningMessage(
        "A board with this name already exists."
      );
      setTimeout(
        () => setWarningMessage(""),
        3000
      );
      return;
    }

    try {
      if (
        modalMode === "edit" &&
        selectedBoard
      ) {
        await updateBoard(
          selectedBoard.id,
          data
        );
      } else {
        await createBoard(data);
      }
      setOpenModal(false);
      setSelectedBoard(null);
      fetchBoards();
    } catch (err) {
      console.error(
        "Failed to save board",
        err
      );
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchBoards, 1000); // delay 1s for loading
    return () => clearTimeout(delay);
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <FancyLoader />
      ) : (
        <BoardList
          boards={boards}
          onOpenCreateBoard={handleCreateClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}
      <BoardModal
        isOpen={openModal}
        mode={modalMode}
        onClose={() => {
          setOpenModal(false);
          setSelectedBoard(null);
          setWarningMessage("");
        }}
        onSave={handleSave}
        initialData={selectedBoard}
        warningMessage={warningMessage}
      />
    </DashboardLayout>
  );
}
