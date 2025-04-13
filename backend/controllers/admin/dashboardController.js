const User = require("../../models/user");
const Product = require("../../models/productModel");
const Order = require("../../models/order");

exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total users" });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `User ${isActive ? "Activated" : "Blocked"} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error });
  }
}

exports.getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total products" });
  }
};

exports.getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); // Count all documents in the Order collection
    res.json({ totalOrders });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({ error: "Failed to fetch total orders" });
  }
} 