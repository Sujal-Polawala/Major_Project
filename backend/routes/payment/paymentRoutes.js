const express = require('express');

const { createPayment, getSessionId, getPaymentId, finalizePayment, stripeWebhook } = require('../../controllers/payment/paymentController');

const router = express.Router();

router.post('/api/stripe-webhook',stripeWebhook);
// Create a payment
router.post('/api/create-payment', createPayment);

// Finalize the payment
router.post('/api/finalize-payment', finalizePayment);

// Get the session ID for payment
router.get('/api/payment-intent/:sessionId', getSessionId);

// Get the payment

router.get('/api/payments/:paymentId', getPaymentId);

// Payment success
// router.get('/api/payment-status/:sessionId', payment_success);

// Success URL

// router.get('/api/payment/success', success_url);

module.exports = router;