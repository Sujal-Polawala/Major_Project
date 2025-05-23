import React from "react";

const CouponSection = ({
  coupons,
  selectedCoupon,
  handleCouponChange,
  handleApplyCoupon,
  handleRemoveCoupon,
}) => (
  <div className="flex flex-col md:flex-row items-center gap-4 w-full p-4 border border-gray-300 rounded-md bg-white">
    <select
      className="w-full md:w-52 sm:w-50 h-10 px-4 border text-primeColor text-sm outline-none border-gray-400 rounded-md"
      onChange={handleCouponChange}
      defaultValue=""
    >
      <option value="">Select a Coupon</option>
      {coupons.map((coupon, index) => (
        <option key={index} value={coupon.code}>
          {coupon.code} ({coupon.type === "flat" ? `$${coupon.discount}` : `${coupon.discount}%`})
          (Min: ${coupon.minPurchase})
        </option>
      ))}
    </select>

    {selectedCoupon && (
      <div className="border p-3 rounded-lg bg-gray-100 text-gray-700 w-full md:w-80 flex flex-col items-center">
        <h3 className="font-bold text-lg text-primeColor border border-dashed bg-white border-gray-500 px-4 py-1 w-full text-center">
          {selectedCoupon.code}
        </h3>
        <p className="text-sm mt-2">
          <strong>Discount:</strong>{" "}
          {selectedCoupon.type === "flat" ? `$${selectedCoupon.discount}` : `${selectedCoupon.discount}%`}
        </p>
        <p className="text-sm">
          <strong>Min Purchase:</strong> ${selectedCoupon.minPurchase}
        </p>
        <p className="text-sm">
          <strong>Max Discounts:</strong> ${selectedCoupon.maxDiscount}
        </p>
        <div className="flex gap-4 mt-2">
          <button onClick={handleApplyCoupon} className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700">
            Apply
          </button>
          <button onClick={handleRemoveCoupon} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
            Remove
          </button>
        </div>
      </div>
    )}
  </div>
);

export default CouponSection;
