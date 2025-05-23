import React from "react";

const CartSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-5 gap-y-4 mb-4 border rounded-xl shadow-sm p-4 animate-pulse bg-white">
      {/* Product Info Skeleton */}
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4">
        {/* Remove icon placeholder */}
        <div className="w-5 h-5 bg-gray-300 rounded-sm" />

        {/* Image placeholder with shimmer */}
        <div className="relative w-28 h-28 bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Title placeholder */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-300 rounded-md" />
          <div className="h-3 w-1/2 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Price, Quantity, Total */}
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between">
        {/* Price */}
        <div className="w-1/3">
          <div className="h-4 w-12 bg-gray-300 rounded-md" />
        </div>

        {/* Quantity Controls */}
        <div className="w-1/3 flex items-center justify-center gap-4">
          <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded-md" />
          <div className="w-6 h-6 bg-gray-300 rounded-md" />
          <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded-md" />
        </div>

        {/* Total */}
        <div className="w-1/3 flex justify-end">
          <div className="h-4 w-16 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
