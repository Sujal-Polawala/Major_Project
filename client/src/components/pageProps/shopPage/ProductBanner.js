import React, { useEffect, useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import { GoTriangleDown } from "react-icons/go";
import axios from "axios";

const ProductBanner = ({ onBadgeFilter, itemsPerPageFromBanner, setSelectedBadge, setSelectedCategory, onCategoryFilter, clearAllFilters, onPriceFilter, setSelectedPriceRange }) => {
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadgeState] = useState("select");
  const [gridViewActive, setGridViewActive] = useState(true);
  const [listViewActive, setListViewActive] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/badge");
        setBadges(response.data);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchBadges();
  }, []);

  const handleBadgeChange = (badge) => {
    setSelectedBadgeState(badge); 
    if (badge !== "select") {
      window.history.pushState({}, "", `?badge=${badge}`);
    } else {
      window.history.pushState({}, "", window.location.pathname); 
    }
    onBadgeFilter(badge);
  };

  const clearFilters = () => {
    setSelectedBadgeState("select");
    setSelectedBadge("");
    setSelectedCategory(null);
    setSelectedPriceRange(null);

    window.history.pushState({}, "", window.location.pathname); 
    onBadgeFilter("select");
    onCategoryFilter(""); 
    onPriceFilter("");
  };

  const handleClearAllFilters = () => {
    clearFilters(); 
    if (clearAllFilters) {
      clearAllFilters(); 
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* View Toggle */}
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <span
          className={`${
            gridViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 flex items-center justify-center cursor-pointer gridView`}
          onClick={() => {
            setListViewActive(false);
            setGridViewActive(true);
          }}
        >
          <BsGridFill />
        </span>
        <span
          className={`${
            listViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 flex items-center justify-center cursor-pointer listView`}
          onClick={() => {
            setGridViewActive(false);
            setListViewActive(true);
          }}
        >
          <ImList />
        </span>
      </div>

      {/* Sort and Show Controls */}
      <div className="flex items-center gap-6 mt-4 md:mt-0 flex-wrap justify-between md:justify-start">
        {/* Sort by Badge */}
        <div className="flex items-center gap-2 text-base relative">
          <label>Sort by:</label>
          <select
            value={selectedBadge} 
            onChange={(e) => handleBadgeChange(e.target.value)}
            className="border-[1px] border-gray-300 py-1 px-4 cursor-pointer text-sm md:text-base"
          >
            <option value="select">SELECT</option>
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <option key={index} value={badge}>
                  {badge}
                </option>
              ))
            ) : (
              <option>Loading...</option>
            )}
          </select>
          <span className="absolute text-sm right-3 top-2">
            <GoTriangleDown />
          </span>
        </div>

        {/* Items Per Page */}
        <div className="flex items-center gap-2">
          <label>Show:</label>
          <select
            onChange={(e) => itemsPerPageFromBanner(+e.target.value)}
            className="border-[1px] border-gray-300 py-1 px-4 cursor-pointer text-sm md:text-base"
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
          </select>
        </div>

        {/* Clear Filter Button */}
        <button
          onClick={handleClearAllFilters}
          className="ml-4 bg-red-500 text-white py-1 px-4 rounded text-sm md:text-base"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default ProductBanner;
