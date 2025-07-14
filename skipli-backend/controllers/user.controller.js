// controllers/user.controller.js
const admin = require("firebase-admin");
const db = admin.firestore();

// GET /users

exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Failed to fetch users",
      detail: err.message,
    });
  }
};

// GET /users/:id

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const userDoc = await db
      .collection("users")
      .doc(id)
      .get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    res.status(200).json({
      id: userDoc.id,
      ...userDoc.data(),
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      message: "Failed to fetch user",
      detail: err.message,
    });
  }
};

// PUT /users/:id

exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { email, verificationCode, name } =
    req.body;

  // Build only the fields that were sent
  const updates = {};
  if (email !== undefined)
    updates.email = email;
  if (verificationCode !== undefined)
    updates.verificationCode = verificationCode;
  if (name !== undefined) updates.name = name;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      message: "No fields provided to update",
    });
  }

  try {
    const userRef = db
      .collection("users")
      .doc(id);
    await userRef.set(updates, { merge: true });

    const updatedDoc = await userRef.get();
    res.status(200).json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      message: "Failed to update user",
      detail: err.message,
    });
  }
};
