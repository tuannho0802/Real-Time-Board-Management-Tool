const express = require("express");
const router = express.Router();
const {
  authenticateToken,
} = require("../middleware/auth.middleware");

const {
  getGitHubInfo,
  attachGitHubItem,
  getGitHubAttachments,
  removeGitHubAttachment,
} = require("../controllers/github.controller");

/**
 * @swagger
 * tags:
 *   name: GitHub
 *   description: GitHub integration endpoints
 */

/**
 * @swagger
 * /repositories/{repositoryId}/github-info:
 *   get:
 *     summary: Retrieve GitHub info for a repository
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: repositoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The repository ID
 *     responses:
 *       200:
 *         description: GitHub data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 repositoryId:
 *                   type: string
 *                 branches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       lastCommitSha:
 *                         type: string
 *                 pulls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       pullNumber:
 *                         type: string
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       issueNumber:
 *                         type: string
 *                 commits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sha:
 *                         type: string
 *                       message:
 *                         type: string
 */
router.get(
  "/repositories/:repositoryId/github-info",
  authenticateToken,
  getGitHubInfo
);

/**
 * @swagger
 * /boards/{boardId}/cards/{cardId}/tasks/{taskId}/github-attach:
 *   post:
 *     summary: Attach GitHub item to a task
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
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
 *               - type
 *               - number
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [pull_request, commit, issue]
 *               number:
 *                 type: string
 *     responses:
 *       201:
 *         description: GitHub item attached to task
 */
router.post(
  "/boards/:boardId/cards/:cardId/tasks/:taskId/github-attach",
  authenticateToken,
  attachGitHubItem
);

/**
 * @swagger
 * /boards/{boardId}/cards/{cardId}/tasks/{taskId}/github-attachments:
 *   get:
 *     summary: Get GitHub attachments for a task
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of GitHub attachments
 */
router.get(
  "/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments",
  authenticateToken,
  getGitHubAttachments
);

/**
 * @swagger
 * /boards/{boardId}/cards/{cardId}/tasks/{taskId}/github-attachments/{attachmentId}:
 *   delete:
 *     summary: Remove a GitHub attachment from a task
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: attachmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Attachment removed
 */
router.delete(
  "/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId",
  authenticateToken,
  removeGitHubAttachment
);

module.exports = router;
