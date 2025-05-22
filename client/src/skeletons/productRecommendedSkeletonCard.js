import React from "react";

const SkeletonRecommendedProduct = () => {
  return (
    <div className="flex items-center gap-4 p-3 border border-gray-300 rounded-md animate-pulse">
      {/* Image Placeholder */}
      <div className="w-16 h-18 bg-gray-300 rounded-md"></div>

      {/* Text Content Placeholder */}
      <div className="flex flex-col flex-grow space-y-2">
        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonRecommendedProduct;
