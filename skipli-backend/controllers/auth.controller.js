const { db } = require("../services/firebase");
const {
  sendCodeEmail,
} = require("../services/email");
const generateCode = require("../utils/generateCode");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const signup = async (req, res) => {
  const { email } = req.body;
  const code = generateCode();

  try {
    await db
      .collection("users")
      .doc(email)
      .set({ email, verificationCode: code });
    await sendCodeEmail(email, code);
    res
      .status(200)
      .json({
        message: "Verification code sent",
      });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Signup failed",
        detail: err.message,
      });
  }
};

const signin = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const userDoc = await db
      .collection("users")
      .doc(email)
      .get();
    const user = userDoc.data();

    if (
      !user ||
      user.verificationCode !== verificationCode
    ) {
      return res
        .status(401)
        .json({
          error:
            "Invalid email or verification code",
        });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res
      .status(200)
      .json({ accessToken: token });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Signin failed",
        detail: err.message,
      });
  }
};

module.exports = { signup, signin };
