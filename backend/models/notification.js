const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // ✅ New field for read/unread status
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
