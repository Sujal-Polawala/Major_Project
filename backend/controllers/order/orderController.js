const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Order = require("../../models/order"); // Adjust the path to your Order model
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const Product = require("../../models/productModel");
const Seller = require("../../models/seller");
const { checkStockAndNotify } = require("../product/checkStockAndNotify");
const { createNotification } = require("../notifications/notificationController");

const generateInvoicePDF = async (orderId, order, filePath) => {
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Company Info & Logo (Top Right)
  const logoPath = path.join(__dirname, "LOGO.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 400, 0, { width: 120 });
  } else {
    console.error("Logo file not found:", logoPath);
  }

  // Company Name & Address (Top Left)
  doc.fontSize(18).text("StyleVerse", 50, 30);
  doc.fontSize(10).text("76876 Aashritha Glens,", 50, 50);
  doc.text("Pillaborough, Daman and Diu", 50, 65);
  doc.text("Phone: +91-XXXXXXXXXX", 50, 80);

  // Invoice Title (Centered Below Header)
  doc.moveDown(2).fontSize(16).text("INVOICE", { align: "center", underline: true });

  // Invoice Details Section
  doc.fontSize(10);
  doc.text(`Invoice Number: ${order._id}`, 50, 140);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 155);
  
  doc.text(`Billed To: ${order.paymentId.cardHolderName}`, 400, 140);
  doc.text("Address:", 400, 155);
  doc.text(`${order.userId.address.address || "N/A"},`, 400, 170);
  doc.text(`${order.userId.address.city || "N/A"}, ${order.userId.address.state || "N/A"}`, 400, 190);
  doc.text(`${order.userId.address.pincode || "N/A"}, ${order.userId.address.country || "N/A"}`, 400, 200);
  doc.text(`Phone: ${order.userId.address.mobileno || "N/A"}`, 400, 215);

  // Draw Line Separator
  doc.moveTo(50, 230).lineTo(570, 230).stroke();

  // Table Headers
  const tableTop = 250;
  doc.fontSize(10).text("S.No", 50, tableTop)
    .text("Title", 90, tableTop, { width: 120 })
    .text("Description", 220, tableTop, { width: 150 })
    .text("Quantity", 380, tableTop)
    .text("Unit Price", 450, tableTop)
    .text("Total", 520, tableTop);
  
  doc.moveTo(50, tableTop + 15).lineTo(570, tableTop + 15).stroke();

  // Table Rows
  let currentY = tableTop + 30;
  let serialNumber = 1;
  
  order.items.forEach((item) => {
    const description = item.productId?.description || "-";
    if (currentY > 720) {
      doc.addPage();
      currentY = 50;
      
      doc.fontSize(10).text("S.No", 50, currentY)
      .text("Title", 90, currentY, { width: 120 })
        .text("Description", 220, currentY, { width: 150 })
        .text("Quantity", 380, currentY)
        .text("Unit Price", 450, currentY)
        .text("Total", 520, currentY);
      
        doc.moveTo(50, currentY + 15).lineTo(570, currentY + 15).stroke();
      currentY += 30;
    }

    doc.fontSize(10)
      .text(serialNumber, 50, currentY)
      .text(item.title || "N/A", 90, currentY, { width: 120 })
      .text(description, 220, currentY, { width: 150 })
      .text(item.quantity.toString(), 380, currentY)
      .text(`$${item.price.toFixed(2)}`, 450, currentY)
      .text(`$${(item.price * item.quantity).toFixed(2)}`, 520, currentY);
    
    currentY += 40;
    serialNumber++;
  });

  // Draw Line Separator before Total Section
  doc.moveTo(50, currentY + 10).lineTo(570, currentY + 10).stroke();
  currentY += 30;

  // Total Amount
  doc.fontSize(12).text("Grand Total:", 400, currentY + 10);
  doc.fontSize(12).text(`$${order.totalPrice.toFixed(2)}`, 500, currentY);

  // Footer Message
  doc.moveDown(5);
  doc.fontSize(12).text("Thank you for your order!", 50, currentY + 70, { align: "center" })
  .text("We hope to serve you again soon.", { align: "center" });

  doc.end();
  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve());
    writeStream.on("error", reject);
  });
};


exports.sendInvoiceEmail = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch the order details by orderId
    const order = await Order.findById(orderId)
      .populate("items.productId", "description")
      .populate("userId", "email username address");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const invoicesDir = path.join(__dirname, "../../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(invoicesDir, `invoice-${orderId}.pdf`);

    // Generate the PDF invoice
    await generateInvoicePDF(orderId, order, filePath);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.userId.email,
      subject: `Invoice for Order ${order._id}`,
      text: `Dear ${order.userId.username},\n\nPlease find your invoice for order ${order._id} attached.\n\nThank you!`,
      attachments: [
        {
          filename: `invoice-${orderId}.pdf`,
          path: filePath,
        },
      ],
    };

    // Send the email with the invoice attachment
    try {
      await transporter.sendMail(mailOptions);
      console.log("Invoice email sent successfully!");
      res.status(200).json({ message: "Invoice sent to email!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.downloadOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch the order details by orderId
    const order = await Order.findById(orderId)
      .populate("items.productId", "description")
      .populate("userId", "username address firstname lastname")
      .populate("paymentId", "cardHolderName");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const invoicesDir = path.join(__dirname, "../../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(invoicesDir, `invoice-${orderId}.pdf`);

    // Generate the PDF invoice
    await generateInvoicePDF(orderId, order, filePath);

    // Provide the generated invoice for download
    res.download(filePath, `invoice-${orderId}.pdf`, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error downloading the invoice." });
      }
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.placeOrder = async (orderDetails) => {
  const { userId, cartItems, totalPrice, shippingAddress, paymentId, discount } = orderDetails;

  try {
    if (!userId || !cartItems || !cartItems.length || !totalPrice) {
      throw new Error("Missing required fields for order.");
    }

    // Reduce product count (quantity)
    for (const item of cartItems) {
      const product = await Product.findOne({ _id: item.productId });

      if (!product) {
        throw new Error(`Product not found: ${item.title}`);
      }

      // Check if stock is available
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.title}`);
      }

      // Reduce stock
      product.quantity -= item.quantity;
      await product.save();

      await checkStockAndNotify(item.productId, product.sellerId);
    }

    // Create order
    const order = new Order({
      userId,
      items: cartItems.map((item) => ({
        productId: item.productId,
        sellerId: item.sellerId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
      })),
      totalPrice,
      discount,
      paymentId,
      shippingAddress,
      status: "Processing",
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)), // Estimated delivery
    });

    order.orderId = order._id.toString();
    
    const savedOrder = await order.save();
    console.log("Order placed successfully, product count updated:", savedOrder);
    
    // Track updated sellers
    const updatedSellers = new Set();

    // Process seller orders and notifications
    for (const item of cartItems) {
      const seller = await Seller.findOne({ sellerId: item.sellerId });
      if (seller && !updatedSellers.has(seller._id.toString())) {
        seller.orders.push(savedOrder._id);
        await seller.save();
        updatedSellers.add(seller._id.toString());

        console.log(`Added order to seller ${seller.userName}`);

        // Notification message
        const message = `📦 New order placed for '${item.title}'`;
        const receiverId = seller._id.toString();

        // Check if global.onlineUsers is defined and seller is online
        if (global.onlineUsers && global.onlineUsers.has(receiverId)) {
          const sellerSocket = global.onlineUsers.get(receiverId);
          if (sellerSocket) {
            await global.io.to(sellerSocket.socketId).emit("receiveNotification", { message, type: "new_order" });
          }
        }

        // Store notification in the database
        await createNotification({ receiverId, message, type: "new_order" });
      }
    }

    return savedOrder;
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw new Error("Failed to place order");
  }
};


exports.getAllOrder = async (req, res) => {
  try {
    const { sellerId } = req.query;
    let query = {}; // Initialize query object

    if (sellerId) {
      query["items.sellerId"] = sellerId; // Filter orders by sellerId
    }

    const orders = await Order.find(query)
      .populate({
        path: "items.sellerId",
        select: "name",
      })
      .populate({
        path: "paymentId",
        select: "cardHolderName",
      })
      .lean()
      .exec();

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (
      !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: orderId  },
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully!", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// Get Order By UserId
exports.getOrderByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).populate("items.productId");
    if (!orders || orders.length === 0) {
      return res.status(404).send({ message: "Orders not found" });
    }
    res.send(orders);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ error: "Server error" });
  }
};

exports.getOrderData = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const order = await Order.findOne({ userId }).sort({ createdAt: -1 }); // Get the latest order

    if (!order) {
      return res.status(404).json({ message: "No order found" });
    }

    res.status(200).json(order); // Return the order details
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};
