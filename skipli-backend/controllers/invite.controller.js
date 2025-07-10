const admin = require("firebase-admin");
const db = admin.firestore();
const {
  sendCodeEmail,
} = require("../utils/mailer");

exports.sendInvite = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email } = req.body;
    const sender = req.user.email;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Email is required" });
    }

    // Optional: check if board exists
    const boardRef = db
      .collection("boards")
      .doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      return res
        .status(404)
        .json({ error: "Board not found" });
    }

    // Store invite in Firestore
    await db.collection("invites").add({
      boardId,
      email,
      invitedBy: sender,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Send email (simple format)
    const message = `<p>You have been invited to the board: <strong>${
      boardDoc.data().name
    }</strong> by ${sender}.</p>`;
    await sendCodeEmail(email, message);

    res.status(200).json({
      message: "Invite sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send invite",
      detail: error.message,
    });
  }
};
