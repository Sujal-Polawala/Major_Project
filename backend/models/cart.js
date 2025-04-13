const mongoose = require('mongoose');

// Cart Schema 
const cartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Optional if you track users
    addedAt: { type: Date, default: Date.now },
  });
  
  const Cart = mongoose.model("Cart", cartSchema, "Cart");

  module.exports = Cart;