const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * This will sends an email (reused for verification code or invites)
 * @param {string} to - Recipient's email
 * @param {string} htmlContent - HTML body
 */
const sendCodeEmail = async (
  to,
  htmlContent
) => {
  const mailOptions = {
    from: `"Skipli App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You've received an invitation",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendCodeEmail };
