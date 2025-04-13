import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { PopupMsg } from "../../components/popup/PopupMsg";
import ShippingAddress from "../ShippingAddress/ShippingAddress"

const Cart = () => {
  const dispatch = useDispatch();
  // let cartItems = useSelector((state) => state.orebiReducer.cartItems);
  const [originalTotalAmt, setOriginalTotalAmt] = useState(0);
  const [ cartItems, setCartItems ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coupons , setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const { state } = useContext(AuthContext);
  const [ proceedToCheckout, setProceedToCheckout ] = useState(false); //
  const { user } = state || {}; 
  const userId = user?.userId;
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });
  const [totalAmt, setTotalAmt] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/cart/${userId}`
        );
        setCartItems(response.data);
        console.log("Cart items:", response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setIsLoading(false);
      }
    };
    if(userId) {
      fetchCartItems();
    }
  }, [userId]);

  useEffect(() => {
    let price = 0;
    cartItems.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
    setOriginalTotalAmt(price);
  }, [cartItems]);

  useEffect(() => {
    if (totalAmt > 0) {
      setShippingCharge(5)
    } else {
      setShippingCharge(0)
    }
  }, [totalAmt]);

  useEffect(() => {
    const getCoupon =async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-coupons`);
        setCoupons(response.data)
      } catch (error) {
        console.error("Error :",error);
      }
    }

    getCoupon()
  }, []);

  const handleCouponChange = (event) => {
    const selected = coupons.find(coupon => coupon.code === event.target.value);
    setSelectedCoupon(selected);
  };

  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      setPopup({ message: "Please select a coupon!", type: "error", show: true });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/apply-coupon`, {
        code: selectedCoupon.code,
        cartTotal: originalTotalAmt, // Use original total to apply discount
      });

      if (response.data.success) {
        setTotalAmt(response.data.finalAmount);
        setDiscountAmt(response.data.discountAmount);
        setCouponApplied(true);
        setPopup({
          message: `Coupon applied! You saved $${response.data.discountAmount.toFixed(2)}`,
          type: "success",
          show: true,
        });
      } else {
        setPopup({ message: response.data.error, type: "error", show: true });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setPopup({ message: "Failed to apply coupon", type: "error", show: true });
    }
  };


  const handleRemoveCoupon = () => {
    setTotalAmt(originalTotalAmt); // Restore the original total amount
    setSelectedCoupon(null); // Deselect the applied coupon
    setCouponApplied(false);
    setPopup({ message: "Coupon removed successfully", type: "success", show: true });
  };
  

  const totalPrice = totalAmt;
  
  const handleDelete = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== cartItemId)
    );
    setPopup({
      message: "Cart item Removed successfully",
        type: "success",
        show: true,
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setPopup({
        message: "Failed to Remove cart item",
        type: "error",
        show: true,
      });
    }
  };
  
  const clearCart = async () => {
    const clearCartResponse = await axios.delete(
      `http://localhost:5000/api/cart/clear/${userId}`
    );
    
    if(clearCartResponse.status === 200) {
      console.log("Cart cleared successfully")
      
      setCartItems([]);
    }
  }

  const handleQuantityChange = async (itemId, action) => {
    try {
      console.log("Sending request for itemId:", itemId);
  
      // Fetch product details
      const response = await axios.get(`http://localhost:5000/products/${itemId}`);
      const product = response.data;
  
      let updatedCartItems = cartItems
        .map((item) => {
          if (item.productId === itemId) {
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
      const updatedItem = updatedCartItems.find((item) => item.productId === itemId);
      if (updatedItem) {
        await axios.put(`http://localhost:5000/api/cart/update`, {
          userId: userId,
          productId: itemId,
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

  const handleProceedToCheckout = () => {
    setProceedToCheckout(true);
  }

  if(proceedToCheckout) {
    return (
      <ShippingAddress 
      cartItems={cartItems}
      totalPrice={totalPrice}
      discount={discountAmt}
      clearCart={clearCart}
      />
    );
  }
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {cartItems.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>
          <div className="mt-5">
            {cartItems.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} handleDelete={handleDelete} handleQuantityChange={handleQuantityChange} />
              </div>
            ))}
          </div>
            {popup.show && <PopupMsg message={popup.message} type={popup.type} /> }
          <button
            onClick={clearCart}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full p-4 border border-gray-300 rounded-md bg-white">
            {/* Dropdown List */}
            <select
              className="w-full md:w-52 sm:w-50 h-10 px-4 border text-primeColor text-sm outline-none border-gray-400 rounded-md"
              onChange={handleCouponChange}
              defaultValue=""
            >
              <option value="">Select a Coupon</option>
              {coupons.map((coupon, index) => (
                <option key={index} value={coupon.code}>
                  {coupon.code} ({coupon.type === "flat" ? `$${coupon.discount}` : `${coupon.discount}%`}) (Min: ${coupon.minPurchase})
                </option>
              ))}
            </select>

            {/* Coupon Details Card (Responsive) */}
            {selectedCoupon && (
              <div className="border p-3 rounded-lg bg-gray-100 text-gray-700 w-full md:w-80 flex flex-col items-center">
                <h3 className="font-bold text-lg text-primeColor border border-dashed bg-white border-gray-500 px-4 py-1 w-full text-center">
                  {selectedCoupon.code}
                </h3>
                <p className="text-sm mt-2"><strong>Discount:</strong> {selectedCoupon.type === "flat" ? `$${selectedCoupon.discount}` : `${selectedCoupon.discount}%`}</p>
                <p className="text-sm"><strong>Min Purchase:</strong> ${selectedCoupon.minPurchase}</p>
                <p className="text-sm"><strong>Max Discounts:</strong>${selectedCoupon.maxDiscount}</p>
              </div>
            )}

          <div className="flex justify-between items-center w-full">
                  {selectedCoupon && (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleApplyCoupon}
                disabled={couponApplied} // Disable button if a coupon is already applied
                className={`bg-blue-600 text-white font-semibold py-2 px-4 hover:bg-blue-700 transition ${
                  couponApplied ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Apply
              </button>
              <button 
                  onClick={handleRemoveCoupon}
                  className="bg-red-600 text-white font-semibold py-2 px-4 hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            )}

              <p className="text-lg font-semibold ml-auto">Update Cart</p>
            </div>
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    ${originalTotalAmt.toFixed(2)}
                  </span>
                </p>
                {couponApplied && (<p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  discount Amount
                  <span className="font-semibold tracking-wide font-titleFont">
                    ${discountAmt.toFixed(2)}
                  </span>
                </p>)}
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    ${shippingCharge}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    ${(totalAmt + shippingCharge).toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                {/* <Link to="/paymentgateway"> */}
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
