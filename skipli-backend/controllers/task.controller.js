const admin = require("firebase-admin");
const db = admin.firestore();

// GET all tasks
exports.getTasks = async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const snapshot = await db.collection("cards").doc(cardId).collection("tasks").get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      cardId,
      ...doc.data(),
    }));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get tasks",
      detail: error.message,
    });
  }
};

// GET single task
exports.getTask = async (req, res) => {
  try {
    const { id: cardId, taskId } = req.params;
    const taskDoc = await db.collection("cards").doc(cardId).collection("tasks").doc(taskId).get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      id: taskDoc.id,
      cardId,
      ...taskDoc.data(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get task",
      detail: error.message,
    });
  }
};

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const { boardId, id: cardId } = req.params;

    if (!cardId) return res.status(400).json({ error: "cardId is required" });

    const newTask = {
      title,
      description,
      status,
      cardId,
      boardId,
      ownerId: req.user?.uid || req.user?.id || req.user?.email || "unknown",
      createdAt: new Date().toISOString(),
    };

    const taskRef = await db.collection("cards").doc(cardId).collection("tasks").add(newTask);
    const response = { id: taskRef.id, ...newTask };

    res.status(201).json(response);

    
    const io = req.app.get("io");
    io.to(`card-${cardId}`).emit("task-created", response);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create task",
      detail: error.message,
    });
  }
};

// UPDATE task
exports.updateTask = async (req, res) => {
  try {
    const { id: cardId, taskId } = req.params;
    const updates = req.body;

    const taskRef = db.collection("cards").doc(cardId).collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Task not found" });

    await taskRef.update(updates);
    const updatedTask = { id: taskId, cardId, ...updates };

    res.status(200).json(updatedTask);

    
    const io = req.app.get("io");
    io.to(`card-${cardId}`).emit("task-updated", updatedTask);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update task",
      detail: error.message,
    });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const { id: cardId, taskId } = req.params;

    const taskRef = db.collection("cards").doc(cardId).collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Task not found" });

    await taskRef.delete();
    res.status(204).send();

    
    const io = req.app.get("io");
    io.to(`card-${cardId}`).emit("task-deleted", taskId);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete task",
      detail: error.message,
    });
  }
};

// ASSIGN member to task
exports.assignMember = async (req, res) => {
  try {
    const { id: cardId, taskId } = req.params;
    const { memberId } = req.body;

    const taskRef = db.collection("cards").doc(cardId).collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Task not found" });

    await taskRef.collection("assignments").doc(memberId).set({
      assignedAt: new Date().toISOString(),
    });

    res.status(201).json({ taskId, memberId });

    
    const io = req.app.get("io");
    io.to(`card-${cardId}`).emit("task-assigned", { taskId, memberId });
  } catch (error) {
    res.status(500).json({
      error: "Failed to assign member",
      detail: error.message,
    });
  }
};

// GET assigned members
exports.getAssignedMembers = async (req, res) => {
  try {
    const { id: cardId, taskId } = req.params;

    const assignmentsSnapshot = await db
      .collection("cards")
      .doc(cardId)
      .collection("tasks")
      .doc(taskId)
      .collection("assignments")
      .get();

    const members = assignmentsSnapshot.docs.map((doc) => ({
      taskId,
      memberId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get assigned members",
      detail: error.message,
    });
  }
};

// REMOVE member from task
exports.removeMemberAssignment = async (req, res) => {
  try {
    const { id: cardId, taskId, memberId } = req.params;

    const taskRef = db.collection("cards").doc(cardId).collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Task not found" });

    await taskRef.collection("assignments").doc(memberId).delete();
    res.status(204).send();

    
    const io = req.app.get("io");
    io.to(`card-${cardId}`).emit("task-unassigned", { taskId, memberId });
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove assignment",
      detail: error.message,
    });
  }
};
