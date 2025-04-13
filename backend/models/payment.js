const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  carts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      title: { type: String, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      sellerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  sessionId: { type: String, required: true },
  paymentId: { type: String },
  totalPrice: { type: Number, required: true },
  discount: { type: Number },
  transactionId: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cardHolderName: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'unpaid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now() },
  shippingAddress: { 
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    mobileno: { type: String, required: true },
  },
});

const Payment = mongoose.model('Payment', paymentSchema, 'Payment');

module.exports = Payment;