import React from "react";
import { Link } from "react-router-dom";
import InvoiceDropdown from "./InvoiceDropdown";

const OrderCard = ({ order, user }) => {
  return (
    <div
      key={order._id}
      className={`border rounded-lg shadow-md hover:shadow-lg transition-all`}
    >
      {/* Order Details */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Order Placed:{" "}
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-medium">
                ${order.totalPrice.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-gray-500">Ship To: {user.username}</p>
          </div>
          <div className="text-right">
            <div>
              <p
                className={`text-sm font-bold ${
                  order.status === "Pending"
                    ? "text-yellow-500"
                    : order.status === "Shipped"
                    ? "text-blue-500"
                    : order.status === "Delivered"
                    ? "text-green-500"
                    : order.status === "Cancelled"
                    ? "text-red-500"
                    : order.status === "Processing"
                    ? "text-orange-500" // Color for Processing
                    : "text-gray-600" // Default color
                }
                          `}
              >
                Order Status: {order.status}
              </p>

              <Link
                to={`/orders-details/${order._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {" "}
                View Order Details{" "}
              </Link>
            </div>
            {order.status === "Delivered" ? (
              <InvoiceDropdown orderId={order._id} />
            ) : (
              <p className="text-red-500 text-sm">
                Invoice available after delivery
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`p-6 rounded-lg`}>
        {order.items.map((item) => (
          <div
            key={item._id}
            className={`flex items-center gap-6 mb-4 rounded-lg p-4`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 rounded-md"
            />
            <div>
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
