const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true},
  price: { type: Number, required: true }, // Ensure price is required
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: function () { return this.image !== null; }, default: null },
  badge: {
    type: String,
    enum: ["Popular", "Top Rated", "Average", "Luxury", "Affordable", "Standard"],
    default: "Popular",
  },
  quantity: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  vector : {type : [Number]} // Ensure sellerId is required and correctly referenced
}, { timestamps: true }); // Add timestamps for createdAt & updatedAt

// Create the Product model
const Product = mongoose.model("Product", productSchema, "Product");

module.exports = Product;
