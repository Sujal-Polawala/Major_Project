import React from "react";

const CartSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2 animate-pulse">
      {/* Product Info Skeleton */}
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        {/* Remove button placeholder */}
        <div className="w-4 h-4 bg-gray-300 rounded-sm" />

        {/* Image placeholder */}
        <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-400 rounded-full" />
        </div>

        {/* Title placeholder */}
        <div className="h-6 w-32 bg-gray-300 rounded" />
      </div>

      {/* Quantity and Price Skeleton */}
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        {/* Price placeholder */}
        <div className="w-1/3">
          <div className="h-6 w-12 bg-gray-300 rounded" />
        </div>

        {/* Quantity placeholder */}
        <div className="w-1/3 flex items-center gap-6">
          <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded" />
          <div className="w-6 h-6 bg-gray-300 rounded" />
          <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded" />
        </div>

        {/* Total placeholder */}
        <div className="w-1/3">
          <div className="h-6 w-16 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;