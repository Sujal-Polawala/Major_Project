import React from "react";
import { MdLocalShipping } from "react-icons/md";
import { CgRedo } from "react-icons/cg";
import { BsShieldCheck } from "react-icons/bs";

const BannerBottom = () => {
  return (
    <div className="w-full bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Warranty */}
        <div className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
          <span className="text-3xl text-indigo-600">
            <BsShieldCheck />
          </span>
          <p className="text-gray-700 text-lg font-semibold">2 Years Warranty</p>
        </div>

        {/* Free Shipping */}
        <div className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
          <span className="text-3xl text-green-600">
            <MdLocalShipping />
          </span>
          <p className="text-gray-700 text-lg font-semibold">Free Shipping</p>
        </div>

        {/* Return Policy */}
        <div className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
          <span className="text-3xl text-red-600">
            <CgRedo />
          </span>
          <p className="text-gray-700 text-lg font-semibold">30-Day Return Policy</p>
        </div>
      </div>
    </div>
  );
};

export default BannerBottom;
