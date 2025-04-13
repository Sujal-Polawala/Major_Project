const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const PendingVerification = require("../../models/PendingVerification");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const {
  Verification_Email_Template,
} = require("../../Middleware/EmailTemplate");
const Seller = require("../../models/seller");
const { createNotification } = require("../notifications/notificationController");

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send emails
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Our Platform Team" <${process.env.EMAIL_USER}>`, // Friendly name for the sender
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Register Controller
exports.register = async (req, res) => {
  const { username, password, confirmPassword, email, firstname, lastname } =
    req.body;

  try {
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !email ||
      !firstname ||
      !lastname
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const existingPending = await PendingVerification.findOne({ email });
    if (existingPending) {
      return res.status(400).json({
        message:
          "A verification email has already been sent. Please check your email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const pendingUser = new PendingVerification({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      verificationCode,
    });

    await pendingUser.save();
    // Send Verification Email
    const emailSubject = "Verify Your Email";
    const emailContent = Verification_Email_Template.replace(
      "{verificationCode}",
      verificationCode
    );
    await sendEmail(email, emailSubject, emailContent);
    const io = global.io
    const admins = await Seller.find({role : '0'});

    if(admins.length > 0){
      const message = `New User ${pendingUser.username} Signed`;

      admins.forEach((admin) => {
        io.emit("receiveNotification", {receiverId: admin._id.toString(), message, type: "new_user" })
      })

      await Promise.all(admins.map(admin => 
        createNotification({ receiverId: admin._id.toString(), message, type: "new_user" })
      ));
    }

    res.status(201).json({
      message:
        "Verification email sent. Please check your email to complete registration.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Email Controller
exports.verifyEmail = async (req, res) => {
  console.log("Received data:", req.body); // Debugging

  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ message: "Email and verification code are required." });
  }

  try {
    const pendingUser = await PendingVerification.findOne({
      email,
      verificationCode: code,
    });

    if (!pendingUser) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    //Create user in the main User collection
    const newUser = new User({
      username: pendingUser.username,
      email: pendingUser.email,
      firstname: pendingUser.firstname,
      lastname: pendingUser.lastname,
      password: pendingUser.password, // Already hashed
      isVerified: true,
    });

    const savedUser = await newUser.save();
    savedUser.userId = savedUser._id.toString();
    await savedUser.save();

    // Remove from PendingVerification collection
    await PendingVerification.deleteOne({ email });
    const emailSubject = "Welcome to Our Platform StyleVerse!";
    const emailContent = `
      <h1>Welcome, ${savedUser.firstname} ${savedUser.lastname}!</h1>
      <p>Your account has been successfully created with the following details:</p>
      <ul>
        <li><strong>Username:</strong> ${savedUser.username}</li>
        <li><strong>Email:</strong> ${savedUser.email}</li>
      </ul>
      <p>Now You can Log in. We're excited to have you onboard. You can now log in to your account and explore our platform.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The StyleVerse Team</p>`;
    await sendEmail(email, emailSubject, emailContent);
    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//resend code
exports.resendCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const pendingUser = await PendingVerification.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({ message: "Email not found in pending verification." });
    }

    const elapsedTime = Date.now() - new Date(pendingUser.expiresAt).getTime();
    if (elapsedTime < 60000) {
      return res.status(400).json({ message: "You can only request a new code after 1 minute." });
    }

    // Generate 6-digit numeric code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the code and reset the timer
    pendingUser.verificationCode = newCode;
    pendingUser.expiresAt = Date.now();
    await pendingUser.save();

    // Send email with new code
    const emailSubject = "Welcome to Our Platform StyleVerse!";
    const emailContent = `
      <h1>Welcome, ${pendingUser.firstname} ${pendingUser.lastname}!</h1>
      <p>Your new verification code is: ${newCode}</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The StyleVerse Team</p>`;
    await sendEmail(email, emailSubject, emailContent);

    res.status(200).json({ message: "A new verification code has been sent." });
  } catch (error) {
    console.error("Error during resend code:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Login Controller
const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if the user is blocked
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }

    // Skip locked account check if the user is active
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: "Account locked. Try again later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;

      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME; // Lock for 5 minutes
        await user.save();

        // Send email notification (optional)
        const emailSubject = "Account Locked";
        const emailText = `Hello ${user.firstname},\n\nYour account has been locked due to multiple failed login attempts.\nThanks,\nThe StyleVerse Team.`;
        sendEmail(user.email, emailSubject, emailText);

        return res.status(403).json({ message: "Account locked. Please try again later." });
      }

      await user.save();
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Send email notification after successful login (optional)
    const emailSubject = "Successful Login Notification";
    const emailText = `Hello ${user.firstname} ${user.lastname},\n\nYou have successfully logged into your account.\nIf this wasn't you, please reset your password.\n\nThanks,\nThe StyleVerse Team.`;
    sendEmail(user.email, emailSubject, emailText);

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded.id).select(
      "-password -confirmPassword"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
