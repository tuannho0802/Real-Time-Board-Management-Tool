const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const {
  getCards,
  createCard,
  getCard,
  updateCard,
  deleteCard,
} = require("../controllers/card.controller");

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management endpoints
 */

/**
 * @swagger
 * /boards/{boardId}/cards:
 *   get:
 *     summary: Get all cards for a board
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the board
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get("/:boardId/cards", getCards);

/**
 * @swagger
 * /boards/{boardId}/cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card created
 */
router.post("/:boardId/cards", createCard);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}:
 *   get:
 *     summary: Get a card by ID
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card found
 */
router.get("/:boardId/cards/:id", getCard);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}:
 *   put:
 *     summary: Update a card by ID
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card updated
 */
router.put("/:boardId/cards/:id", updateCard);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}:
 *   delete:
 *     summary: Delete a card by ID
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Card deleted
 */
router.delete(
  "/:boardId/cards/:id",
  deleteCard
);

module.exports = router;
