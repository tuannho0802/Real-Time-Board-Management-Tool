const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const {
  sendInvite,
} = require("../controllers/invite.controller");
const {
  authenticateToken,
} = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Invites
 *   description: Invite users to boards
 */

/**
 * @swagger
 * /boards/{boardId}/invite:
 *   post:
 *     summary: Invite a user to a board via email
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Invite sent successfully
 *       400:
 *         description: Missing email
 *       404:
 *         description: Board not found
 */
router.post(
  "/:boardId/invite",
  authenticateToken,
  sendInvite
);

module.exports = router;
