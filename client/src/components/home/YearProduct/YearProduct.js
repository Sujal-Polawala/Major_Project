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
      <div className="w-full h-auto md:h-80 mb-20 bg-[#f3f3f3] relative font-titleFont rounded-lg overflow-hidden shadow-md">
        {loading ? (
          <SkeletonBanner />
        ) : (
          <>
            <Image
              className="w-full h-full object-cover"
              imgSrc={productOfTheYear}
            />
            <div className="w-fit h-80 md:w-2/3 xl:w-1/2 bg-black bg-opacity-40 absolute top-0 right-0 items-start gap-6 flex flex-col justify-center p-6 md:p-12 text-white">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                2025's Top Pick: Elevate Your Style
              </h1>
              <p className="text-sm md:text-base mb-4 max-w-2xl mr-4">
                Discover our most popular product of the year—loved by thousands
                for its unmatched quality and modern design. Perfect for any
                wardrobe.
              </p>
              <ShopNow />
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default YearProduct;