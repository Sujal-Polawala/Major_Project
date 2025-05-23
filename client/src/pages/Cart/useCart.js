import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/ApiConfig";

const useCart = (userId) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [proceedToCheckout, setProceedToCheckout] = useState(false);
  const [totalAmt, setTotalAmt] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(5); // default $5 shipping
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/coupons`);
        setCoupons(response.data);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      }
    };

    if (userId) {
      fetchCart();
      fetchCoupons();
    }
  }, [userId]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems, selectedCoupon]);

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    let discount = 0;

    if (selectedCoupon) {
      const { type, discount: disc, minPurchase, maxDiscount } = selectedCoupon;

      if (subtotal >= minPurchase) {
        if (type === "flat") {
          discount = Math.min(disc, maxDiscount);
        } else if (type === "percentage") {
          discount = Math.min((subtotal * disc) / 100, maxDiscount);
        }
      }
    }

    setTotalAmt(subtotal - discount);
    setDiscountAmt(discount);
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/clear/${userId}`);
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/delete/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      showPopup("Item removed from cart", "success");
    } catch (error) {
      console.error("Error deleting cart item", error);
      showPopup("Error deleting item", "error");
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    try {
      await axios.put(`${API_BASE_URL}/api/cart/update/${id}`, { quantity });
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Error updating quantity", error);
      showPopup("Failed to update quantity", "error");
    }
  };

  const handleCouponChange = (e) => {
    const code = e.target.value;
    const coupon = coupons.find((c) => c.code === code);
    setSelectedCoupon(coupon || null);
  };

  const handleApplyCoupon = () => {
    if (!selectedCoupon) {
      showPopup("Please select a coupon", "error");
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (subtotal < selectedCoupon.minPurchase) {
      showPopup(
        `Minimum purchase must be $${selectedCoupon.minPurchase}`,
        "error"
      );
      return;
    }

    showPopup(`Coupon ${selectedCoupon.code} applied`, "success");
    calculateTotal();
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    showPopup("Coupon removed", "info");
  };

  const handleProceedToCheckout = () => {
    setProceedToCheckout(true);
  };

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  return {
    cartItems,
    isLoading,
    popup,
    proceedToCheckout,
    totalAmt,
    discountAmt,
    selectedCoupon,
    coupons,
    clearCart,
    handleDelete,
    handleQuantityChange,
    handleCouponChange,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleProceedToCheckout,
    shippingCharge,
    setShippingCharge
  };
};

export default useCart;
