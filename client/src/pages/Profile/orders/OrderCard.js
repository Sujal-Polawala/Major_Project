import React, { useState } from "react";
import { Link } from "react-router-dom";
import InvoiceDropdown from "./InvoiceDropdown";

const OrderCard = ({ order, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="border rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Order Placed: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
          </p>
          <p className="text-sm text-gray-500">
            Total: <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-500">Ship To: {user.username}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${
            order.status === "Delivered" ? "text-green-500" :
            order.status === "Shipped" ? "text-blue-500" :
            order.status === "Cancelled" ? "text-red-500" :
            order.status === "Pending" ? "text-yellow-500" :
            "text-gray-700"
          }`}>Order Status: {order.status}</p>
          <Link to={`/orders-details/${order._id}`} className="text-blue-600 text-sm hover:underline">View Order Details</Link>
          {order.status === "Delivered" ? (
            <InvoiceDropdown orderId={order._id} dropdownOpen={dropdownOpen} toggleDropdown={toggleDropdown} />
          ) : (
            <p className="text-red-500 text-sm">Invoice available after delivery</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
