import React from "react";

const OrderCardSkeleton = () => {
  return (
    <div className="border rounded-lg shadow-md animate-pulse">
      {/* Top Section */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          {/* Left Info */}
          <div>
            <div className="h-4 bg-gray-300 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          {/* Right Info */}
          <div className="text-right space-y-2">
            <div className="h-4 bg-gray-300 rounded w-28"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-40"></div> {/* invoice note */}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-md" /> {/* product image */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCardSkeleton;