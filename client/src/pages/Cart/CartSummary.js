import React from "react";

const CartSummary = ({ totalAmt, discountAmt, handleProceedToCheckout, shippingCharge }) => {
  return (
    <div className="flex justify-end mt-5">
      <div className="border p-6 bg-white shadow-md rounded-lg w-full md:w-1/2 lg:w-1/3">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${(totalAmt + discountAmt).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount</span>
          <span>- ${discountAmt.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping Charge</span>
          <span>${shippingCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2 font-bold">
          <span>Total</span>
          <span>${totalAmt.toFixed(2)}</span>
        </div>
        <button
          onClick={handleProceedToCheckout}
          className="mt-4 w-full bg-primeColor text-white py-2 rounded hover:bg-black"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
