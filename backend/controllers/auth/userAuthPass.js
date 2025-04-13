const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Forgot Password Controller
exports.forgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a token with a 3-hour expiration
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "3h" });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email with reset link

    const resetLink = `http://localhost:3001/reset-password/${user._id}/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `
          <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_self" rel="noreferrer noopener">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email Error:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      return res.status(200).json({ message: "Reset link sent successfully" });
    });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Controller
exports.resetPass = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token and check expiration
    const decoded = jwt.verify(token, "secret");

    // Check if the token matches the user's ID
    if (decoded.id !== id) {
      return res.status(401).json({ message: "Invalid token or user ID" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password in the database
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Successfully",
      html: `
          <p>Hello ${user.firstname + " " + user.lastname || "User"},</p>
          <p>Your password has been reset successfully. If you did not perform this action, please contact our support StyleVerse team immediately.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset successfully and email sent." });
  } catch (error) {
    console.error("Error in resetPass:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Reset link expired. Please request a new one." });
    }

    res.status(500).json({ message: "Server error" });
  }
};
