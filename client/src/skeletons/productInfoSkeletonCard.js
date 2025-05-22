import React from "react";

const SkeletonProductInfoCard = () => {
  return (
    <div className="w-full mx-auto p-6 bg-white border rounded-xl shadow-lg animate-pulse space-y-4">
      <div className="h-8 bg-gray-300 rounded w-3/4"></div> {/* Title */}
      <div className="h-6 bg-gray-300 rounded w-1/2"></div> {/* Price */}
      <div className="h-6 bg-gray-300 rounded w-1/3"></div> {/* Quantity */}
      <div className="h-20 bg-gray-300 rounded w-full"></div> {/* Description */}
      <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* Category */}
      <div className="h-12 bg-gray-300 rounded w-full mt-4"></div> {/* Button */}
    </div>
  );
};

export default SkeletonProductInfoCard;