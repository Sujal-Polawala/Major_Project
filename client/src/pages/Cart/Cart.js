import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ShippingAddress from "../ShippingAddress/ShippingAddress";
import { AuthContext } from "../../context/AuthContext";
import { PopupMsg } from "../../components/popup/PopupMsg";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import CouponSection from "./CouponSection";
import useCart from "./useCart";
import emptyCart from "../../assets/images/emptyCart.png"; // Adjust the path and filename as needed

const Cart = () => {
  const { state } = useContext(AuthContext);
  const { user } = state || {};
  const userId = user?.userId;

  const {
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
  } = useCart(userId);

  if (proceedToCheckout) {
    return (
      <ShippingAddress
        cartItems={cartItems}
        totalPrice={totalAmt}
        discount={discountAmt}
        clearCart={clearCart}
      />
    );
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {cartItems.length > 0 ? (
        <>
          <CartList
            cartItems={cartItems}
            handleDelete={handleDelete}
            handleQuantityChange={handleQuantityChange}
          />

          {popup.show && <PopupMsg message={popup.message} type={popup.type} />}

          <button
            onClick={clearCart}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>

          <CouponSection
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            handleCouponChange={handleCouponChange}
            handleApplyCoupon={handleApplyCoupon}
            handleRemoveCoupon={handleRemoveCoupon}
          />

          <CartSummary
            totalAmt={totalAmt}
            discountAmt={discountAmt}
            handleProceedToCheckout={handleProceedToCheckout}
            shippingCharge={shippingCharge}
          />
        </>
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