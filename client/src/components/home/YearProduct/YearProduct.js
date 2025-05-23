import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productOfTheYear from "../../../assets/images/Banner1.png";
import ShopNow from "../../designLayouts/buttons/ShopNow";
import Image from "../../designLayouts/Image";

// Inline Skeleton Loader Component
const SkeletonBanner = () => (
  <div className="w-full h-80 mb-20 bg-gray-200 animate-pulse rounded-md" />
);

const YearProduct = () => {
  const [loading, setLoading] = useState(true);

  // Simulate image loading delay
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Link to="/shop">
      <div className="w-full h-auto mb-20 rounded-lg overflow-hidden shadow-md">
        {loading ? (
          <SkeletonBanner />
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-80 md:h-auto">
              <Image
                className="w-full h-full object-cover"
                imgSrc={productOfTheYear}
              />
            </div>

            {/* Content Section */}
            <div className="absolute md:relative top-0 left-0 w-full h-full md:w-1/2 flex items-center justify-center bg-black bg-opacity-40 md:bg-white md:bg-opacity-100 text-white md:text-black p-6 md:p-12">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  2025's Top Pick: Elevate Your Style
                </h1>
                <p className="text-sm md:text-base mb-4">
                  Discover our most popular product of the year—loved by thousands
                  for its unmatched quality and modern design. Perfect for any
                  wardrobe.
                </p>
                <ShopNow />
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default YearProduct;