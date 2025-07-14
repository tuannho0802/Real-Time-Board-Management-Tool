const { db } = require("../services/firebase");
const jwt = require("jsonwebtoken");

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

const createBoard = async (req, res) => {
  const user = getUserFromToken(req);
  if (!user)
    return res
      .status(401)
      .json({ error: "Unauthorized" });

  const { name, description } = req.body;

  try {
    const boardRef = await db
      .collection("boards")
      .add({
        name,
        description,
        owner: user.email,
        createdAt: new Date().toISOString(),
      });

    const boardData = {
      id: boardRef.id,
      name,
      description,
      owner: user.email,
    };

    res.status(201).json(boardData);

    const io = req.app.get("io");
    io.to(user.email).emit(
      "board-created",
      boardData
    );
  } catch (err) {
    res
      .status(500)
      .json({ error: "Create board failed" });
  }
};

const getBoards = async (req, res) => {
  const user = getUserFromToken(req);
  if (!user)
    return res
      .status(401)
      .json({ error: "Unauthorized" });

  try {
    const snapshot = await db
      .collection("boards")
      .where("owner", "==", user.email)
      .get();

    const boards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(boards);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Get boards failed" });
  }
};

const getBoard = async (req, res) => {
  const user = getUserFromToken(req);
  if (!user)
    return res
      .status(401)
      .json({ error: "Unauthorized" });

  try {
    const boardDoc = await db
      .collection("boards")
      .doc(req.params.id)
      .get();
    if (!boardDoc.exists)
      return res
        .status(404)
        .json({ error: "Board not found" });

    res.status(200).json({
      id: boardDoc.id,
      ...boardDoc.data(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Get board failed" });
  }
};

const updateBoard = async (req, res) => {
  const user = getUserFromToken(req);
  if (!user)
    return res
      .status(401)
      .json({ error: "Unauthorized" });

  const { name, description } = req.body;

  try {
    const boardRef = db
      .collection("boards")
      .doc(req.params.id);
    await boardRef.update({
      name,
      description,
    });

    const updatedBoardDoc =
      await boardRef.get();
    const updatedBoard = {
      id: updatedBoardDoc.id,
      ...updatedBoardDoc.data(),
    };

    res.status(200).json(updatedBoard);

    const io = req.app.get("io");
    io.to(user.email).emit(
      "board-updated",
      updatedBoard
    );
  } catch (err) {
    res
      .status(500)
      .json({ error: "Update board failed" });
  }
};

const deleteBoard = async (req, res) => {
  const user = getUserFromToken(req);
  if (!user)
    return res
      .status(401)
      .json({ error: "Unauthorized" });

  try {
    await db
      .collection("boards")
      .doc(req.params.id)
      .delete();
    res.status(204).send();

    const io = req.app.get("io");
    io.to(user.email).emit(
      "board-deleted",
      req.params.id
    );
  } catch (err) {
    res
      .status(500)
      .json({ error: "Delete board failed" });
  }
};

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
