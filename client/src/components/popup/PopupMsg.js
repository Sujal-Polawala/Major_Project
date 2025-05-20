import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PopupMsg = ({ message, type = "info", onClose }) => {
  // Dynamic background and icon based on the type
  const typeStyles = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  const icon = {
    success: "✓",
    error: "✗",
    info: "ℹ",
  };

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm border-l-4 p-4 rounded-lg shadow-lg ${typeStyles[type]}`}
    >
      <div className="flex items-center">
        <span className="mr-2 text-2xl">{icon[type]}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};

const CartPopup = ({ productInfo, qty, setShowPopup }) => {
  const navigate = useNavigate();
  console.log(productInfo);

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg border border-gray-200 p-4 rounded-lg z-50">
      <div className="flex justify-between items-center">
        <h4 className="text-gray-800 font-bold">Just Added to Your Cart</h4>
        <button
          onClick={() => setShowPopup(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div className="flex items-center mt-2">
        <img
          src={productInfo.image}
          alt={productInfo.title}
          className="w-12 h-12 rounded-lg object-cover mr-3"
        />
        <div>
          <p className="font-semibold text-gray-800">{productInfo.title}</p>
          <p className="text-gray-600">Qty: {qty}</p>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          navigate("/cart");
        }}
      >
        View Cart
      </button>
      <button
        className="ml-4 text-blue-600 hover:underline"
        onClick={() => {
          setShowPopup(false);
          navigate("/shop");
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export { PopupMsg, CartPopup };