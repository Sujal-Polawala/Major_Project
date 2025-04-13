import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import SearchOrders from "./SearchOrders";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { PopupMsg } from "../../components/popup/PopupMsg";
// import Spinner from "../Spinner";

function MyOrder() {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const { state } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("last 30 days");
  const [searchTerm, setSearchTerm] = useState("");
  const userId = user?.userId;

  const [loadingInvoice, setLoadingInvoice] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    const fetchOrderData = async () => {
      if (isLoggedIn && userId) {
        try {
          const ordersResponse = await axios.get(
            `http://localhost:5000/api/orders/user/${userId}`
          );
          setOrders(ordersResponse.data);
          setFilteredOrders(ordersResponse.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      }
    };
    fetchOrderData();

    const interval = setInterval(fetchOrderData, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn, userId]);

  useEffect(() => {
    filterOrders();
  }, [filter, searchTerm, orders]);

  const filterOrders = () => {
    const now = new Date();
    let filtered = orders;

    if (filter === "last 30 days") {
      const last30Days = new Date(now.setDate(now.getDate() - 30));
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= last30Days
      );
    } else if (filter === "past 3 months") {
      const last3Months = new Date(now.setMonth(now.getMonth() - 3));
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= last3Months
      );
    } else if (filter !== "Archived Orders") {
      const selectedYear = parseInt(filter, 10);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt).getFullYear() === selectedYear
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleInvoiceClick = (orderId) => {
    setActiveDropdown((prev) => (prev === orderId ? null : orderId));
    setLoadingInvoice(orderId);
    setTimeout(() => setLoadingInvoice(null), 1000);
  };

  const handleInvoiceDownload = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/invoice/${orderId}`,
        { responseType: "blob" } // Important for binary data
      );
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  const handleEmailInvoice = async (orderId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/invoice/email/${orderId}`
      );
      setPopup({
        message: "Invoice Has Sent to Your Email Address",
        type: "success",
        show: true,
      })
    } catch (error) {
      console.error("Error sending email:", error);
      setPopup({
        message: "Error sending email. Please try again later.",
        type: "error",
        show: true,
      })
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200">
            No user logged in.
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  //   if (isLoading) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
  //         <Spinner />
  //       </div>
  //     );
  //   }

  const years = Array.from(
    new Set(orders.map((order) => new Date(order.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <div className={`min-h-screen max-w-container mx-auto p-4`}>
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <Breadcrumbs title="MyOrders" prevLocation={prevLocation} />
      <div className="max-w-6xl mx-auto px-6">
        <header className="my-2">
          <h1 className={`text-4xl font-extrabold`}>Your Orders</h1>
        </header>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <SearchOrders
            orders={orders}
            onSearchChange={handleSearchTermChange}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 hover:cursor-pointer border rounded-lg shadow-sm bg-white text-gray-700 focus:ring focus:outline-none"
          >
            <option value="last 30 days">Last 30 Days</option>
            <option value="past 3 months">Past 3 Months</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
            <option value="Archived Orders">Archived Orders</option>
          </select>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-8">
            {filteredOrders.map((order) => (
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
                      <p className="text-sm text-gray-500">
                        Ship To: {user.username}
                      </p>
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
                      <div className="relative">
                        {order.status === "Delivered" ? (
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            onClick={() => handleInvoiceClick(order._id)}
                          >
                            Invoice ▼
                          </button>
                        ) : (
                          <p className="text-red-500 text-sm">
                            Invoice available after delivery
                          </p>
                        )}

                        {activeDropdown === order._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg text-gray-700">
                            {loadingInvoice === order._id ? (
                              <div className="flex items-center justify-center py-2">
                                <svg
                                  className="animate-spin h-5 w-5 text-blue-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8H4z"
                                  ></path>
                                </svg>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleInvoiceDownload(order._id)
                                  }
                                  className="block px-4 py-2 hover:bg-gray-100"
                                >
                                  Download Invoice
                                </button>
                                <button
                                  onClick={() => handleEmailInvoice(order._id)}
                                  className="block px-4 py-2 hover:bg-gray-100"
                                >
                                  Email Invoice
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
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
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyOrder;