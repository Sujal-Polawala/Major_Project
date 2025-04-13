const mongoose = require("mongoose");

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
      {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
          title: String,
          price: Number,
          quantity: Number,
          image: String,
          category: String, 
      }
  ],
  totalPrice: Number,
  orderId: { type: String, unique: true }, 
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  discount: Number,
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
    mobileno: { type: String },
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  deliveryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema, "Order");

module.exports = Order;
