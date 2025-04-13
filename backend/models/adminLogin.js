const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const Admin = mongoose.model("Admin", AdminSchema, "admin");

module.exports = Admin;