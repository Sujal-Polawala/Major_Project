const Order = require("../models/order");
const Product = require("../models/productModel");
const Seller = require("../models/seller");
const User = require("../models/user");

const resolvers = {
  Query: {
    orders: async (_, { sellerId }) => {
      try {
        const orders = await Order.find({ "items.sellerId": sellerId });
    
        // Filter out the seller's products and calculate the correct sales amount
        const sellerOrders = orders.map((order) => {
          const sellerItems = order.items.filter(
            (item) => item.sellerId.toString() === sellerId
          );
    
          const sellerTitle = sellerItems.map((item) => item.title).join(", "); // Convert array to string
          
          // const sellerTotalPrice = sellerItems.reduce(
          //   (sum, item) => sum + item.price * item.quantity,
          //   0
          // );
    
          return {
            _id: order._id,
            totalPrice: order.totalPrice, // Only sum up this seller's products
            createdAt: order.createdAt,
            title: sellerTitle, // Now a string
          };
        });
    
        return sellerOrders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders");
      }
    },   
    
    order: async (_, { sellerId }) => {
      try {
        const orders = await Order.find({ "items.sellerId": sellerId });
        const sellerOrders = orders.map((order) => {
          const sellerItems = order.items.filter(
            (item) => item.sellerId.toString() === sellerId
          );
          
          const sellerTotalPrice = sellerItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
    
          return {
            _id: order._id,
            totalPrice: sellerTotalPrice, // Only sum up this seller's products
            createdAt: order.createdAt,// Now a string
          };
        });
    
        return sellerOrders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders");
      }
    },
    // Get Seller Orders
    seller: async (_, { sellerId }) => {
      try {
        const orders = await Order.find({ "items.sellerId": sellerId });

        // Filter out the seller's products and calculate the correct sales amount
        const sellerOrders = orders.map((order) => {
          const sellerItems = order.items.filter(
            (item) => item.sellerId.toString() === sellerId
          );
          const sellerTotalPrice = sellerItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return {
            _id: order._id,
            totalPrice: sellerTotalPrice, // Only sum up this seller's products
            createdAt: order.createdAt,
          };
        });

        return sellerOrders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders");
      }
    },

    // Get Total number of Orders
    totalOrders: async () => {
      try {
        return await Order.countDocuments();
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },

    //Get Total Products
    totalProduct: async () => {
      try {
        return await Product.countDocuments();
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },

    //Get Total Products by Seller
    totalProductsBySeller: async (_, { sellerId }) => {
      try {
        return await Product.countDocuments({ sellerId });
      } catch (error) {
        console.error("Error fetching total products by seller:", err);
        throw new Error("Error fetching total products by seller");
      }
    },

    //Get Total Orders by Seller
    totalOrdersBySeller: async (_, { sellerId }) => {
      try {
        const totalOrders = await Order.countDocuments({
          "items.sellerId": sellerId,
        });
        return totalOrders;
      } catch (error) {
        console.error("Error fetching total orders by seller:", error);
        throw new Error("Error fetching total orders by seller");
      }
    },

    // Get Total number of Users
    totalUsers: async () => {
      try {
        return await User.countDocuments();
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },

    // Get Total number of Sellers
    totalSellers: async () => {
      try {
        return await Seller.countDocuments({ role: 1, status: 'approved' });
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },    

    // Get Total Revenue
    totalRevenue: async () => {
      try {
        const orders = await Order.find();
        return orders.reduce((total, order) => total + order.totalPrice, 0);
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },

    // Get Total Admin Income
    totalAdminIncome: async () => {
      try {
        // Get all orders
        const orders = await Order.find();

        // Fetch all sellers
        const sellers = await Seller.find().lean();

        // Calculate total earnings of all sellers dynamically
        let sellerTotalEarnings = 0;

        for (const seller of sellers) {
          const sellerOrders = await Order.find({
            "items.sellerId": seller._id,
          });

          // Calculate total sales for this seller
          const sellerTotal = sellerOrders.reduce((sum, order) => {
            const sellerItems = order.items.filter(
              (item) => item.sellerId.toString() === seller._id.toString()
            );
            return (
              sum +
              sellerItems.reduce(
                (itemSum, item) => itemSum + item.price * item.quantity,
                0
              )
            );
          }, 0);

          console.log(sellerTotal);

          sellerTotalEarnings += sellerTotal;
        }

        // Calculate total revenue from all orders
        const totalRevenue = orders.reduce(
          (total, order) => total + order.totalPrice,
          0
        );

        // Admin's income = Total Revenue - Sellers' earnings
        const adminIncome = sellerTotalEarnings - totalRevenue;

        console.log("Total Revenue:", totalRevenue);
        console.log("Seller Total Earnings:", sellerTotalEarnings);
        console.log("Total Admin Income:", adminIncome);

        return adminIncome;
      } catch (err) {
        console.error("Error calculating admin income:", err);
        throw new Error(err.message);
      }
    },

    sellers: async () => {
      try {
        const sellers = await Seller.find({ role: 1 }).lean();

        const sellersWithOrders = await Promise.all(
          sellers.map(async (seller) => {
            const orders = await Order.find({ "items.sellerId": seller._id });

            const filteredOrders = orders.map((order) => {
              const sellerItems = order.items.filter(
                (item) => item.sellerId.toString() === seller._id.toString()
              );

              const sellerTotalPrice = sellerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return {
                _id: order._id,
                totalPrice: sellerTotalPrice,
                createdAt: order.createdAt,
              };
            });

            const totalSales = filteredOrders.reduce(
              (sum, order) => sum + order.totalPrice,
              0
            );

            return {
              ...seller,
              orders: filteredOrders,
              totalSales, // Ensure this is included
            };
          })
        );

        return sellersWithOrders;
      } catch (error) {
        console.error("Error fetching sellers:", error);
        throw new Error("Error fetching sellers");
      }
    },

    // Get the best-selling products
    bestSellingProducts: async () => {
      try {
        const products = await Product.aggregate([
          {
            $lookup: {
              from: "Order", // Join with the orders collection
              localField: "_id", // Match the productId in the items array of orders
              foreignField: "items.productId",
              as: "Order",
            },
          },
          {
            $unwind: "$Order", // Unwind the orders to access individual orders
          },
          {
            $unwind: "$Order.items", // Unwind the items array to access each product
          },
          {
            $match: {
              "Order.items.productId": { $exists: true }, // Ensure that productId exists
            },
          },
          {
            $group: {
              _id: { productId: "$_id", orderId: "$Order._id" }, // Group by productId and orderId to avoid counting the same product multiple times in a single order
              title: { $first: "$title" }, // Get the product title
              quantity: { $first: "$Order.items.quantity" }, // Ensure that the quantity is counted only once per product in the same order
            },
          },
          {
            $group: {
              _id: "$_id.productId", // Group by productId to aggregate across different orders
              title: { $first: "$title" }, // Get the product title
              totalSales: { $sum: "$quantity" }, // Sum the quantity for this product across all orders
            },
          },
          {
            $sort: { totalSales: -1 }, // Sort by total sales in descending order
          },
          {
            $limit: 5, // Limit to top 5 best-selling products
          },
        ]);

        // Return the results with formatted product data
        return products.map((product) => ({
          _id: product._id.toString(),
          title: product.title,
          sales: product.totalSales || 0, // Default to 0 if no sales
        }));
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
        throw new Error("Error fetching best-selling products");
      }
    },
  },
};

module.exports = resolvers;
