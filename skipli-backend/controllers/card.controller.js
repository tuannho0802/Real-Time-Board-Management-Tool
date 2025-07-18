const admin = require("firebase-admin");
const db = admin.firestore();

// GET /boards/:boardId/cards
exports.getCards = async (req, res) => {
  try {
    const { boardId } = req.params;
    const snapshot = await db
      .collection("boards")
      .doc(boardId)
      .collection("cards")
      .get();

    const cards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get cards",
      detail: error.message,
    });
  }
};

// POST /boards/:boardId/cards
exports.createCard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name, description, createdAt } =
      req.body;

    const newCard = {
      name,
      description,
      createdAt:
        createdAt || new Date().toISOString(),
    };

    const cardRef = await db
      .collection("boards")
      .doc(boardId)
      .collection("cards")
      .add(newCard);

    const response = {
      id: cardRef.id,
      ...newCard,
    };

    res.status(201).json(response);

    const io = req.app.get("io");
    io.to(`board-${boardId}`).emit(
      "card-created",
      response
    );
  } catch (error) {
    res.status(500).json({
      error: "Failed to create card",
      detail: error.message,
    });
  }
};

// GET /boards/:boardId/cards/:id
exports.getCard = async (req, res) => {
  try {
    const { boardId, id } = req.params;
    const cardDoc = await db
      .collection("boards")
      .doc(boardId)
      .collection("cards")
      .doc(id)
      .get();

    if (!cardDoc.exists) {
      return res
        .status(404)
        .json({ error: "Card not found" });
    }

    res.status(200).json({
      id: cardDoc.id,
      ...cardDoc.data(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get card",
      detail: error.message,
    });
  }
};

// PUT /boards/:boardId/cards/:id
exports.updateCard = async (req, res) => {
  try {
    const { boardId, id } = req.params;
    const updates = req.body;

    await db
      .collection("boards")
      .doc(boardId)
      .collection("cards")
      .doc(id)
      .update(updates);

    const updatedCard = { id, ...updates };
    res.status(200).json(updatedCard);

    const io = req.app.get("io");
    io.to(`board-${boardId}`).emit(
      "card-updated",
      updatedCard
    );
  } catch (error) {
    res.status(500).json({
      error: "Failed to update card",
      detail: error.message,
    });
  }
};

// DELETE /boards/:boardId/cards/:id
exports.deleteCard = async (req, res) => {
  try {
    const { boardId, id } = req.params;

    await db
      .collection("boards")
      .doc(boardId)
      .collection("cards")
      .doc(id)
      .delete();

    res.status(204).send();

    const io = req.app.get("io");
    io.to(`board-${boardId}`).emit(
      "card-deleted",
      id
    );
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete card",
      detail: error.message,
    });
  }
};
