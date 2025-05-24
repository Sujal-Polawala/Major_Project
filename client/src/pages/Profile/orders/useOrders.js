import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { API_BASE_URL } from "../../../config/ApiConfig";

const useOrders = () => {
  const { state } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState("last 30 days");
  const [searchTerm, setSearchTerm] = useState("");
  const [popup, setPopup] = useState({ message: "", type: "", show: false });
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (isLoggedIn && user?.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/orders/user/${user.userId}`);
          setOrders(response.data);
          setFilteredOrders(response.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn, user?.userId]);

  useEffect(() => {
    filterOrders();
  }, [filter, searchTerm, orders]);

  const filterOrders = () => {
    const now = new Date();
    let result = [...orders];

    if (filter === "last 30 days") {
      const cutoff = new Date(now.setDate(now.getDate() - 30));
      result = result.filter((o) => new Date(o.createdAt) >= cutoff);
    } else if (filter === "past 3 months") {
      const cutoff = new Date(now.setMonth(now.getMonth() - 3));
      result = result.filter((o) => new Date(o.createdAt) >= cutoff);
    } else if (filter !== "Archived Orders") {
      result = result.filter(
        (o) => new Date(o.createdAt).getFullYear() === parseInt(filter)
      );
    }

    if (searchTerm) {
      result = result.filter((order) =>
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredOrders(result);
  };

  const years = Array.from(new Set(orders.map((o) => new Date(o.createdAt).getFullYear()))).sort((a, b) => b - a);

  return {
    popup,
    prevLocation,
    orders,
    filteredOrders,
    filter,
    years,
    handleSearchTermChange: setSearchTerm,
    handleFilterChange: (val) => setFilter(val),
  };
};

export default useOrders;