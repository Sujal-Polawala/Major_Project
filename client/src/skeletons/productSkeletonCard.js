import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white p-4 rounded-md shadow-sm">
      <div className="bg-gray-300 h-48 w-full rounded-md mb-4" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-300 rounded w-1/4" />
    </div>
  );
};

export default SkeletonCard;