// src/pages/orders/OrderDetailsSkeleton.jsx
import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

const OrderDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <SkeletonBox className="h-10 w-48 mb-6 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-3">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-4 w-64" />
            <SkeletonBox className="h-4 w-48" />
            <SkeletonBox className="h-4 w-52" />
            <SkeletonBox className="h-4 w-56" />
            <SkeletonBox className="h-5 w-40" />
            <SkeletonBox className="h-5 w-44" />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-3">
            <SkeletonBox className="h-6 w-48" />
            <SkeletonBox className="h-4 w-64" />
            <SkeletonBox className="h-4 w-48" />
            <SkeletonBox className="h-4 w-52" />
            <SkeletonBox className="h-4 w-44" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>

        <div className="mt-8">
          <SkeletonBox className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
              >
                <SkeletonBox className="w-24 h-24 rounded-md" />
                <div className="space-y-2">
                  <SkeletonBox className="h-4 w-40" />
                  <SkeletonBox className="h-3 w-24" />
                  <SkeletonBox className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm space-y-3">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-4 w-64" />
          <SkeletonBox className="h-4 w-64" />
          <SkeletonBox className="h-5 w-44" />
          <SkeletonBox className="h-5 w-48" />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;