const express = require("express");
const {
  register,
  verifyEmail,
  login,
  getUserDetails,
  resendCode,
} = require("../../controllers/auth/userAuthController");
const { forgotPass, resetPass } = require("../../controllers/auth/userAuthPass");

const {authMiddleware} = require("../../Middleware/authMiddleware");

const router = express.Router();

// user Registration and Login

router.post("/register", register);
router.post("/login", login);
router.post("/api/verify-email", verifyEmail);
router.post("/api/resend-code", resendCode);
// get user details
router.get("/details", authMiddleware, getUserDetails);

// Forgot Password
router.post("/forgot-password", forgotPass);

router.post("/reset-password/:id/:token", resetPass);

module.exports = router;
