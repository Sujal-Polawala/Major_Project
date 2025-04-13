import React from "react";
import { Link } from "react-router-dom";
import SaleImage1 from "../../../assets/SaleImage1.webp";
import SaleImage2 from "../../../assets/SaleImage2.webp";
import SaleImage3 from "../../../assets/SaleImage3.webp";
import Image from "../../designLayouts/Image";

const Sale = () => {
  return (
    <div className="py-20 px-4 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Section - Large Image */}
      <div className="relative group col-span-2">
        <Link to="/shop">
          <Image
            className="w-full h-[500px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            imgSrc={SaleImage1}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <p className="text-white text-xl font-bold">Shop Now</p>
          </div>
        </Link>
      </div>

      {/* Right Section - Stacked Images */}
      <div className="flex flex-col gap-6">
        <div className="relative group">
          <Link to="/shop">
            <Image
              className="w-full h-[240px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              imgSrc={SaleImage2}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <p className="text-white text-lg font-semibold">Limited Offer</p>
            </div>
          </Link>
        </div>

        <div className="relative group">
          <Link to="/shop">
            <Image
              className="w-full h-[240px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              imgSrc={SaleImage3}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <p className="text-white text-lg font-semibold">Hot Deals</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;
