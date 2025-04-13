const Notification = require('../../models/notification')
const mongoose = require('mongoose');

const getNotification = async (req , res) => {
    try {
        const {sellerId} = req.params;
        const notification = await Notification.find({receiverId: sellerId}).sort({createdAt : -1})

        res.status(200).json(notification)
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const createNotification = async (notificationData) => {
    try {
        // Ensure notificationData is correctly structured
        if (!notificationData || typeof notificationData !== "object") {
            console.error("Invalid notification data format:", notificationData);
            return;
        }

        const { receiverId, message, type } = notificationData;

        if (!receiverId || !message || !type) {
            console.error("Missing required fields:", { receiverId, message, type });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            console.error("Invalid ObjectId format:", receiverId);
            return;
        }

        const newNotification = new Notification({
            receiverId: new mongoose.Types.ObjectId(receiverId), // Ensure correct ObjectId format
            message,
            type,
        });

        await newNotification.save();
    } catch (error) {
        console.error("❌ Error saving notification:", error);
    }
};

const markAsRead = async (req, res) => {
    try {
        const {notificationId} = req.params;
        await Notification.findByIdAndUpdate(notificationId , {isRead : true})

        await Notification.findByIdAndDelete(notificationId);

        await Notification.deleteMany({ isRead: true });
        
        res.status(200).json({message : "Notification marked as Read"})
    } catch (error) {
        console.error("Error Marking notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const markAsAllRead = async (req , res) => {
    try {
        await Notification.updateMany({isRead : false} , {isRead : true})
        res.status(200).json({message : "All Notification marked as Read"})
    } catch (error) {
        res.status(500).json({message : "server error"});
    }
}

const deleteNotification = async (req , res) => {
    try {
        const {notificationId} = req.params;
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message : "Notification Deleted "})
    } catch (error) {
        console.error("Error Delete notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getNotification ,
    createNotification,
    markAsRead,
    deleteNotification,
    markAsAllRead
}