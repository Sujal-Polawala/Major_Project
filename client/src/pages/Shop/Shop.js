import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // For price filter
  const [clearFilters, setClearFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  const [prevLocation, setPrevLocation] = useState("");

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const handleBadgeFilter = (badge) => {
    setSelectedBadge(badge);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceFilter = (priceRange) => {
    setSelectedPriceRange(priceRange); // Set selected price range
  };

  const clearAllFilters = () => {
    setSelectedBadge("");
    setSelectedCategory("");
    setSelectedPriceRange(""); // Reset price filter
    setClearFilters(true);
    setTimeout(() => setClearFilters(false), 100);
  };

  useEffect(() => {
    // Fetch products here if necessary when filters change
    // Pass selectedPriceRange to the backend API
  }, [selectedBadge, selectedCategory, selectedPriceRange]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" prevLocation={prevLocation} />
      <div className="w-full h-full pb-20">
        <button
          className="md:hidden p-2 bg-gray-800 text-white mb-4"
          onClick={toggleFilters}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="flex w-full md:flex-row flex-col gap-6">
          <div className={`w-full ${showFilters ? "block" : "hidden"} md:block md:w-[25%]`}>
            <ShopSideNav
              onCategoryFilter={setSelectedCategory}
              clearFilters={clearFilters}
              onPriceFilter={handlePriceFilter}
            />
          </div>

          <div className="w-full md:w-[75%] h-full flex flex-col gap-10">
            <ProductBanner
              itemsPerPageFromBanner={itemsPerPageFromBanner}
              onBadgeFilter={handleBadgeFilter}
              setSelectedBadge={setSelectedBadge}
              setSelectedCategory={setSelectedCategory}
              onCategoryFilter={handleCategoryFilter}
              onPriceFilter={handlePriceFilter}
              setSelectedPriceRange={setSelectedPriceRange}
              clearAllFilters={clearAllFilters}
            />
            <Pagination
              itemsPerPage={itemsPerPage}
              selectedBadge={selectedBadge}
              selectedCategory={selectedCategory}
              selectedPriceRange={selectedPriceRange} // Pass selected price range to Pagination
              setSelectedBadge={setSelectedBadge}
              setSelectedCategory={setSelectedCategory}
              setSelectedPriceRange={setSelectedPriceRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;