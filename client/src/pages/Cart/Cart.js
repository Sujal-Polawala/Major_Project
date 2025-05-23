import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ShippingAddress from "../ShippingAddress/ShippingAddress";
import { AuthContext } from "../../context/AuthContext";
import { PopupMsg } from "../../components/popup/PopupMsg";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import CouponSection from "./CouponSection";
import useCart from "./useCart";

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
        <div className="text-center text-lg font-medium">Your cart is empty.</div>
      )}
    </div>
  );
};

export default Cart;