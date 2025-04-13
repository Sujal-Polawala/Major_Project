const Product = require("../../models/productModel");
const Notification = require("../../models/notification"); // Ensure Notification model is imported
const io = global.io;

const checkStockAndNotify = async (productId, sellerId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    if (product.quantity <= 5) {
      const notification = new Notification({
        receiverId: sellerId, // Notify the seller
        message: `⚠️ Item '${product.title}' is running low on stock!`,
        type: "low_stock",
      });

      await notification.save();

      // Check if the seller is online before sending WebSocket notification
      if (global.onlineUsers && global.onlineUsers.has(sellerId.toString())) {
        const sellerSocket = global.onlineUsers.get(sellerId.toString());
        console.log(sellerSocket)
        if (sellerSocket) {
          io.to(sellerSocket.socketId).emit("receiveNotification", {
            receiverId: sellerId.toString(),
            message: notification.message, // Use message from notification
            type: "low_stock",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error checking stock:", error);
  }
};

module.exports = {
  checkStockAndNotify,
};
