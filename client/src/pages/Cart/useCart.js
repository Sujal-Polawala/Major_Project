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
        const response = await axios.get(`${API_BASE_URL}/get-coupons`);
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
    if (!cartItems || cartItems.length === 0) return;

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (!selectedCoupon) {
      setTotalAmt(subtotal);
      setDiscountAmt(0);
    }
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
      await axios.delete(`${API_BASE_URL}/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      showPopup("Item removed from cart", "success");
    } catch (error) {
      console.error("Error deleting cart item", error);
      showPopup("Error deleting item", "error");
    }
  };

  const handleQuantityChange = async (id, action) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      const product = response.data;
      let updatedCartItems = cartItems
        .map((item) => {
          if (item.productId === id) {
            let newQuantity =
              action === "increment" ? item.quantity + 1 : item.quantity - 1;

            // Remove item immediately if quantity reaches 0
            if (newQuantity <= 0) {
              handleDelete(item._id); // Call delete function
              return null; // Return null so it gets removed in filtering
            }

            // Check if requested quantity exceeds available stock
            if (newQuantity > product.quantity) {
              setPopup({
                message: "",
                type: "",
                show: false,
              });
              setTimeout(() => {
                setPopup({
                  message: `Only ${product.quantity} items available in stock!`,
                  type: "error",
                  show: true,
                });
              }, 100);
              return item; // Keep the existing quantity
            }

            return { ...item, quantity: newQuantity }; // Update quantity in state
          }
          return item;
        })
        .filter(Boolean); // Remove null values (deleted items)

      // Update cart items state
      setCartItems(updatedCartItems);

      // Send updated quantity to backend (only if item still exists)
      const updatedItem = updatedCartItems.find(
        (item) => item.productId === id
      );
      if (updatedItem) {
        await axios.put(`${API_BASE_URL}/api/cart/update`, {
          userId: userId,
          productId: id,
          quantity: updatedItem.quantity,
        });
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      setPopup({
        message: "Error updating cart item quantity",
        type: "error",
        show: true,
      });
    }
  };

  const handleCouponChange = (e) => {
    const code = e.target.value;
    const coupon = coupons.find((c) => c.code === code);
    setSelectedCoupon(coupon || null);
  };

  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      showPopup("Please select a coupon", "error");
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/apply-coupon`, {
        code: selectedCoupon.code,
        cartTotal: subtotal,
      });

      if (response.data.success) {
        setTotalAmt(response.data.finalAmount);
        setDiscountAmt(response.data.discountAmount);
        showPopup(
          `Coupon applied! You saved $${response.data.discountAmount.toFixed(
            2
          )}`,
          "success"
        );
      } else {
        showPopup(response.data.error || "Failed to apply coupon", "error");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      showPopup("Failed to apply coupon", "error");
    }
  };

  const handleRemoveCoupon = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setTotalAmt(subtotal);
    setDiscountAmt(0);
    setSelectedCoupon(null);
    showPopup("Coupon removed successfully", "info");
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
    setShippingCharge,
  };
};

export default useCart;
