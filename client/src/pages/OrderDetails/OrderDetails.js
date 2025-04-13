import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

function OrderDetails() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderResponse = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`
        );
        setOrder(orderResponse.data);

        if (orderResponse.data.paymentId) {
          const paymentResponse = await axios.get(
            `http://localhost:5000/api/payments/${orderResponse.data.paymentId}`
          );
          setPayment(paymentResponse.data);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <p className="text-center text-gray-500 text-xl">
        Loading order details...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl">{error}</p>;
  }

  if (!order) {
    return (
      <p className="text-center text-gray-500 text-xl">Order not found.</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:px-6 lg:px-8">
      <Breadcrumbs title="Order Details" />
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Order Details
        </h1>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Order Info
            </h2>
            <p className="text-lg text-gray-600">Order ID: {order._id}</p>
            <p className="text-lg text-gray-600">Status: {order.status}</p>
            <p className="text-lg text-gray-600">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-600">
              {order.status === "Delivered" ? 
              `Delivered Date: ${new Date(order.deliveryDate).toLocaleDateString()} (Delivered)` :
              `Expected Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`
            }
            </p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              Discount Amt: ${order.discount ? order.discount.toFixed(2) : 0}
            </p>
            <p className="text-xl font-semibold text-gray-800 mt-">
              Total Price:${order.totalPrice.toFixed(2)}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Shipping Address
            </h2>
            <p className="text-lg text-gray-600">
              Address: {order.shippingAddress.address}, <br />
              City: {order.shippingAddress.city}, <br />
              State: {order.shippingAddress.state},
              <br />
              Pincode: {order.shippingAddress.pincode} <br />
              Country: {order.shippingAddress.country}
            </p>
            <p className="text-lg text-gray-600">
              Phone: {order.shippingAddress.mobileno}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Ordered Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-lg text-gray-700">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {payment && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Payment Details
            </h2>
            <p className="text-lg text-gray-600">
              Payment Method: {payment.paymentMethod}
            </p>
            <p className="text-lg text-gray-600">
              Transaction ID: {payment.transactionId}
            </p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              Discount Amt: ${order.discount ? order.discount.toFixed(2) : 0}
            </p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              Amount Paid: ${payment.totalPrice.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
