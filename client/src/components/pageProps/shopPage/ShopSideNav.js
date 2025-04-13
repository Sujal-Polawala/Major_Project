import React from "react";
import Category from "./shopBy/Category";
// import Color from "./shopBy/Color";
// import Brand from "./shopBy/Brand";
import Price from "./shopBy/Price";

const ShopSideNav = ({ onCategoryFilter, clearFilters, onPriceFilter }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category onCategoryFilter={onCategoryFilter} clearFilters={clearFilters} />
      {/* <Color /> */}
      {/* <Brand /> */}
      <Price onPriceFilter={onPriceFilter} clearFilters={clearFilters} />
    </div>
  );
};

export default ShopSideNav;