const Payment = require("../../models/payment");
const Cart = require("../../models/cart");
const { v4: uuidv4 } = require("uuid");
const { placeOrder } = require("../order/orderController");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret =process.env.STRIPE_WEBHOOK_KEY;

  exports.stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
  
      try {
        // Find the payment record by sessionId
        const payment = await Payment.findOne({ sessionId: session.id });
  
        if (!payment) {
          return console.error(
            "Payment record not found for sessionId:",
            session.id
          );
        }
  
        console.log("Payment record found:", payment);
  
        // Update payment status
        payment.status = "paid";
        payment.cardHolderName = session.customer_details?.name || "Unknown";
        await payment.save();
        console.log("Payment record updated:", payment);
  
        // Extract order details
        const {
          userId,
          carts,
          totalPrice,
          discount,
          _id: paymentId,
          shippingAddress,
        } = payment;
        console.log("Carts:", carts);
  
        // Ensure we have all necessary data
        if (!userId || !carts || !carts.length || !totalPrice) {
          return console.error("Missing order details.");
        }
  
        console.log("Shipping Address:", shippingAddress);
  
        // Create the order (with shipping address)
        const order = await placeOrder({
          userId,
          cartItems: carts,
          totalPrice,
          discount,
          shippingAddress,
          paymentId,
          createdAt: new Date(),
          status: "Pending",
          deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)), // Estimated delivery
        });
  
        console.log("Order placed successfully after payment");

        // Clear the cart
        await Cart.deleteMany({ userId });
        console.log("Cart cleared successfully for user:", userId);
  
        // Send Email Notification to User
        await sendOrderConfirmationEmail(
          session.customer_details.email,
          order,
          payment
        );
      } catch (err) {
        console.error("Error processing payment or order:", err.message);
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
  
      try {
        await Payment.findOneAndUpdate(
          { sessionId: session.id },
          { status: "unpaid" },
          { new: true }
        );
        console.log(
          "Payment status updated to 'unpaid' for sessionId:",
          session.id
        );
      } catch (err) {
        console.error("Error updating payment status:", err.message);
      }
    }
  
    res.json({ received: true });
  };

// Function to send an order confirmation email
const sendOrderConfirmationEmail = async (email, order, payment) => {
  try {
    if (!email || !order || !payment) {
      console.error("Email, order, or payment details missing!");
      return;
    }

    console.log("Preparing to send email with order details:", order);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Order Has Been Confirmed! 🎉",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <div style="text-align: center;">
            <h2 style="color: #333;">Thank you for your order! 🎉</h2>
            <p style="color: #555;">Hello <strong>${
              payment.cardHolderName || "Valued Customer"
            }</strong>, your order has been successfully placed!</p>
          </div>

          <div style="background: #fff; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #333;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${order._id || "N/A"}</p>
            <p><strong>Total Amount:</strong> $${order.totalPrice || "0.00"}</p>
            <p><strong>Payment Status:</strong> ${
              payment.status || "Unknown"
            }</p>
            <p><strong>Shipping Address:</strong> ${
              order.shippingAddress || "Not Provided"
            }</p>
            <p><strong>Estimated Delivery Date:</strong> ${new Date(
              order.deliveryDate
            ).toDateString()}</p>
          </div>

          <div style="margin-top: 20px;">
            <h3 style="color: #333;">Items Ordered:</h3>
            <ul style="list-style: none; padding: 0;">
              ${
                (order.items || [])
                  .map(
                    (item) => `
                <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                  <img src="${item.image || "#"}" alt="${
                      item.title || "Product"
                    }" style="width: 50px; height: 50px; border-radius: 5px; vertical-align: middle; margin-right: 10px;">
                  <strong>${item.title || "Unknown Item"}</strong> - ${
                      item.quantity || 1
                    } x $${item.price || "0.00"}
                </li>
              `
                  )
                  .join("") || "<li>No items found.</li>"
              }
            </ul>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://major-project-three-beta.vercel.app/profile/myorders" style="background: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order</a>
          </div>

          <div style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
            <p>Need help? Contact us at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>
            <p>&copy; 2025 Your Store. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

exports.createPayment = async (req, res) => {
  const { userId, products, paymentMethod, totalPrice, shippingAddress, discount } = req.body;

  try {
    // Validate required fields
    if (!userId || !products || products.length === 0 || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const shippingCharge = 500; // Shipping charge in cents

    console.log("Total Price (After Discount):", totalPrice);

    // Calculate the total price of products before discount
    const originalTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    const withoutShippingCharge = totalPrice - shippingCharge/100;

    const finalTotalPrice = discount > 0 ? withoutShippingCharge : originalTotal

    // Map products into Stripe line items with adjusted unit prices
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
        },
        // Distribute totalPrice proportionally based on original price
        unit_amount: Math.round(((product.price / originalTotal) * finalTotalPrice) * 100), 
      },
      quantity: product.quantity,
    }));

    if (lineItems.length === 0) {
      return res.status(400).json({ message: "No valid products in the cart" });
    }

    // // Add shipping charge as a separate line item
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping Charge",
        },
        unit_amount: shippingCharge,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://major-project-three-beta.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://major-project-three-beta.vercel.app/cancel",
    });

    // Prepare cart data for the database
    const carts = products.map((product) => ({
      productId: product.productId,
      title: product.title,
      image: product.image,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      sellerId: product.sellerId,
    }));

    // Create a new payment record in the database
    const newPayment = new Payment({
      userId,
      carts,
      sessionId: session.id,
      transactionId: uuidv4(),
      paymentMethod,
      totalPrice: finalTotalPrice+(shippingCharge/100), // Store the correct total
      discount,
      status: "pending",
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country,
        mobileno: shippingAddress.mobileno,
      },
      createdAt: new Date(),
    });

    // Save payment to the database
    const payment = await newPayment.save();

    // Assign the generated ID to `paymentId`
    payment.paymentId = payment._id.toString();
    await payment.save();

    // Respond with the session ID and payment details
    res.status(200).json({ sessionId: session.id, paymentId: payment._id });
  } catch (error) {
    console.error("Error creating payment session:", error.message);
    res.status(500).send("Failed to create payment session");
  }
};

exports.finalizePayment = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const cardHolderName = session.customer_details?.name;

    const payment = await Payment.findOneAndUpdate(
      { sessionId },
      { cardHolderName },
      { new: true }
    );

    res.status(200).json({ message: "Payment finalized", payment });
  } catch (error) {
    console.error("Error finalizing payment:", error.message);
    res.status(500).send("Failed to finalize payment");
  }
};

exports.getSessionId = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );
    res.status(200).json({ paymentIntentId: session.payment_intent });
  } catch (error) {
    console.error("Error fetching payment intent:", error);
    res.status(500).json({ error: "Failed to fetch payment intent" });
  }
};

exports.getPaymentId = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error.message);
    res.status(500).send("Failed to fetch payment details");
  }
};

// exports.payment_success = async (req, res) => {
//   const sessionId = req.params.sessionId;

//   // Retrieve payment session details from Stripe
//   const session = await stripe.checkout.sessions.retrieve(sessionId);

//   if (session.payment_status === "paid") {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// };

// exports.success_url = async (req, res) => {
//   const { session_id } = req.query;
//   console.log("Session ID received:", session_id); // Log the session ID to verify it's being passed

//   try {
//     // Retrieve the session from Stripe
//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     console.log("Retrieved session:", session); // Log session data for debugging
//     console.log(session.metadata)

//     // Check if metadata.carts exists before parsing
//     if (session.metadata && session.metadata.carts) {
//       const carts = JSON.parse(session.metadata.carts);
//       console.log("Parsed cart items:", carts); // Log parsed carts

//       const orderData = {
//         userId: session.metadata.userId,
//         cartItems: carts,
//         totalPrice: session.amount_total / 100,
//         paymentStatus: session.payment_status,
//         sessionId: session.id,
//       };

//       // Save order to database (e.g., MongoDB or other storage)
//       await Order.create(orderData);

//       res.json({ success: true, message: "Order placed successfully!" });
//     } else {
//       throw new Error("Cart items not found in session metadata");
//     }
//   } catch (error) {
//     console.error("Error processing payment:", error); // Log detailed error message
//     res.status(500).send("Error processing payment.");
//   }
// };
