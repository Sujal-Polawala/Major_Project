const express = require('express');
const { placeOrder, getAllOrder, getOrderByUser, deleteOrder, getOrder, getOrderData, downloadOrder, sendInvoiceEmail, updateOrderStatus } = require('../../controllers/order/orderController');

const router = express.Router();

// Place an order
router.post('/api/checkout', placeOrder);

// Send invoice email
router.post('/api/orders/invoice/email/:orderId', sendInvoiceEmail);

// Get all orders
router.get('/api/orders', getAllOrder);

// Get an order
router.get('/api/order/:userId', getOrder);

// Get orders by user
router.get('/api/orders/user/:userId', getOrderByUser);

// Get order data by order id
router.get('/api/orders/:orderId', getOrderData);
// Delete an order
router.delete('/api/orders/:id', deleteOrder);

// Download an order
router.get('/api/invoice/:orderId', downloadOrder);

// Update order status
router.put('/api/orders/update-status', updateOrderStatus);

module.exports = router;