import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PopupMsg } from "../../components/popup/PopupMsg";
import { FaCheckCircle } from "react-icons/fa";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { state } = useContext(AuthContext);
  const { user } = state;
  const userId = user?.userId;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [popup, setPopup] = useState({ message: "", type: "", show: false });
  const shippingCharge = 5;

  useEffect(() => {
    if (userId) {
      fetchOrderDetails();
    }
  }, [userId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/order/${userId}`
      );
      setOrderDetails(response.data);

      if (!localStorage.getItem("popupShown")) {
        setPopup({
          message: `Payment successful! Order Status: ${
            response.data.status
          }, Estimated Delivery: ${new Date(
            response.data.deliveryDate
          ).toDateString()}`,
          type: "success",
          show: true,
        });
        localStorage.setItem("popupShown", "true");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup({ ...popup, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        No order details found!
      </div>
    );
  }

  // Calculate the original total (before discount)
  const originalTotal = orderDetails.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const totalAmount = originalTotal + 5;

  const discountApplied = totalAmount > orderDetails.totalPrice;
  const discountAmount = discountApplied
    ? totalAmount - orderDetails.totalPrice
    : 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-6 py-10 animate-fade-in">
      <Breadcrumbs title="Order Success" />
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}

      <div className="bg-white shadow-2xl rounded-2xl p-12 w-full max-w-4xl text-center transform transition duration-300 hover:scale-105 flex-grow">
        <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-5 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-gray-900">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Your order has been placed successfully.
        </p>

        {/* Order Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-left shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          <ul className="space-y-4">
            {orderDetails.items.map((item) => (
              <li
                key={item._id}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-700">Title:</span>
                  <span className="text-gray-900">{item.title}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-700">Category:</span>
                  <span className="text-gray-900">{item.category}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-700">
                    Quantity x Price:
                  </span>
                  <span className="text-gray-900">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Subtotal */}
          {/* Subtotal Section */}
          <div className="flex justify-between items-center text-lg mt-4 bg-gray-100 p-3 rounded-md shadow-sm">
            <span className="font-semibold text-gray-700">Subtotal:</span>
            <span className="text-gray-900 font-medium">
              ${originalTotal.toFixed(2)}
            </span>
          </div>

          {/* Shipping Charge */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200 mt-2">
            <span className="font-semibold text-gray-700">
              Shipping Charge:
            </span>
            <span className="text-gray-900 font-medium">
              ${shippingCharge.toFixed(2)}
            </span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg mt-4 bg-gray-100 shadow-sm border-t border-gray-200">
            <span className="font-semibold text-gray-700">Total:</span>
            <span className="text-gray-900 font-medium">
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Discount Section */}
          {discountApplied && (
            <div className="flex justify-between items-center mt-4 text-lg font-bold text-white bg-red-500 p-3 rounded-md shadow-md border-t border-red-600">
              <span>Discount Applied:</span>
              <span>- ${discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Total Amount */}
          <div className="flex justify-between items-center mt-6 text-2xl font-bold border-t pt-4 text-gray-900">
            <span>Total Amount:</span>
            <span>${orderDetails.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col space-y-4 w-full pb-20">
          <button
            onClick={() => navigate("/profile/myorders")}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-4 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition duration-300 text-lg font-semibold"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white py-4 rounded-lg shadow-md hover:from-gray-500 hover:to-gray-700 transition duration-300 text-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
