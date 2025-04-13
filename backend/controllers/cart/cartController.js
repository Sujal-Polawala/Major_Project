const Cart = require("../../models/cart");
const mongoose = require("mongoose");

// Add Product to cart
exports.AddToCart = async (req, res) => {
  const { productId, quantity, userId } = req.body;

  if (!productId || !quantity || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    // Check if the item already exists in the cart
    const existingItem = await Cart.findOne({ productId, userId });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ success: true, message: "Cart updated" });
    } else {
      const newCartItem = new Cart({ productId, quantity, userId });
      await newCartItem.save();
      return res.status(201).json({ success: true, cartItem: newCartItem });
    }
  } catch (error) {
    console.error("Error processing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Count Total Cart Items
exports.countTotalCartItems = async (req, res) => {
  try {
    const userId = req.params.userId;

    const count = await Cart.countDocuments({ userId });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Unable to fetch cart items" });
  }
};
