import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const SpecialCase = () => {
  const [cartCount, setCartCount] = useState(0);
  const { state } = useContext(AuthContext);
  const { user } = state;
  const userId = user?.userId;

  useEffect(() => {
    if (!userId) return;

    const fetchCartCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/count/${userId}`);
        setCartCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    const intervalId = setInterval(fetchCartCount, 5000);

    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 flex flex-col gap-6">
      {/* Profile Link */}
      <NavItem to="/profile" icon={<MdSwitchAccount />} label="Profile" />

      {/* Cart Link with Count Badge */}
      <NavItem to="/cart" icon={<RiShoppingCart2Fill />} label="Cart">
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
            {cartCount}
          </span>
        )}
      </NavItem>
    </div>
  );
};

// Reusable Sidebar Button
const NavItem = ({ to, icon, label, children }) => {
  return (
    <Link to={to} className="relative group">
      <div className="w-16 h-16 bg-white/40 backdrop-blur-lg border border-gray-300 shadow-lg 
        hover:bg-white hover:shadow-xl transition-all duration-300 rounded-full flex flex-col items-center justify-center cursor-pointer">
        <span className="text-2xl text-gray-800 group-hover:text-black transition-colors">
          {icon}
        </span>
        <p className="text-xs font-semibold text-gray-700 mt-1">{label}</p>
        {children}
      </div>
    </Link>
  );
};

export default SpecialCase;
