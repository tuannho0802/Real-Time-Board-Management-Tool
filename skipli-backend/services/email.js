const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCodeEmail = async (to, code) => {
  const mailOptions = {
    from: `"Skipli Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your verification code",
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendCodeEmail };
