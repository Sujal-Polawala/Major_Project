const express = require('express');
const { getNotification, markAsRead, deleteNotification, markAsAllRead } = require('../../controllers/notifications/notificationController');
const router = express.Router();

router.get('/:sellerId' , getNotification)

router.put('/mark-as-read/:notificationId', markAsRead)

router.delete('/:notificationId', deleteNotification)

router.put('/mark-as-all-read', markAsAllRead)

module.exports = router;