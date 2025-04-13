const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
  userId: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  address: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
    mobileno: { type: String },
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  isActive: { type: Boolean, default: true },
});
const User = mongoose.model("User", UserSchema, "User");

module.exports = User;
