const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignMember,
  getAssignedMembers,
  removeMemberAssignment,
} = require("../controllers/task.controller");
const {
  authenticateToken,
} = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management within cards
 */

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks:
 *   get:
 *     summary: Retrieve all tasks of a card
 *     tags: [Tasks]
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
 *         description: List of tasks
 */
router.get(
  "/:boardId/cards/:id/tasks",
  authenticateToken,
  getTasks
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks:
 *   post:
 *     summary: Create a new task within a card
 *     tags: [Tasks]
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
 *             required: [title, description, status]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post(
  "/:boardId/cards/:id/tasks",
  authenticateToken,
  createTask
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks/{taskId}:
 *   get:
 *     summary: Retrieve task details within a card
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 */
router.get(
  "/:boardId/cards/:id/tasks/:taskId",
  authenticateToken,
  getTask
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks/{taskId}:
 *   put:
 *     summary: Update task details within a card
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put(
  "/:boardId/cards/:id/tasks/:taskId",
  authenticateToken,
  updateTask
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task within a card
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted
 */
router.delete(
  "/:boardId/cards/:id/tasks/:taskId",
  authenticateToken,
  deleteTask
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks/{taskId}/assign:
 *   post:
 *     summary: Assign a member to a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [memberId]
 *             properties:
 *               memberId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member assigned to task
 */
router.post(
  "/:boardId/cards/:id/tasks/:taskId/assign",
  authenticateToken,
  assignMember
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks/{taskId}/assign:
 *   get:
 *     summary: Get members assigned to a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of assigned members
 */
router.get(
  "/:boardId/cards/:id/tasks/:taskId/assign",
  authenticateToken,
  getAssignedMembers
);

/**
 * @swagger
 * /boards/{boardId}/cards/{id}/tasks/{taskId}/assign/{memberId}:
 *   delete:
 *     summary: Unassign a member from a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Member unassigned from task
 */
router.delete(
  "/:boardId/cards/:id/tasks/:taskId/assign/:memberId",
  authenticateToken,
  removeMemberAssignment
);

module.exports = router;
