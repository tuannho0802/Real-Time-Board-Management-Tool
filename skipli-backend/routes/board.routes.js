const express = require("express");
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/board.controller");

const {
  authenticateToken,
} = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Board management endpoints
 */

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Project Alpha
 *               description:
 *                 type: string
 *                 example: This board is for managing the Alpha project.
 *     responses:
 *       201:
 *         description: Board created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  authenticateToken,
  createBoard
);

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all boards of the authenticated user
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get("/", authenticateToken, getBoards);

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get details of a specific board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Board ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board details
 *       404:
 *         description: Board not found
 */
router.get("/:id", authenticateToken, getBoard);

/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Update a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Board ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Board Name
 *               description:
 *                 type: string
 *                 example: Updated description of the board.
 *     responses:
 *       200:
 *         description: Board updated
 *       404:
 *         description: Board not found
 */
router.put(
  "/:id",
  authenticateToken,
  updateBoard
);

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Board ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Board deleted
 *       404:
 *         description: Board not found
 */
router.delete(
  "/:id",
  authenticateToken,
  deleteBoard
);

module.exports = router;
