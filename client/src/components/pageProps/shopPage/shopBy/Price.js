import React, { useEffect, useState } from "react";
import NavTitle from "./NavTitle";

const Price = ({ onPriceFilter, clearFilters }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const priceList = [
    { _id: 1, priceOne: 0.0, priceTwo: 49.99 },
    { _id: 2, priceOne: 50.0, priceTwo: 99.99 },
    { _id: 3, priceOne: 100.0, priceTwo: 199.99 },
    { _id: 4, priceOne: 200.0, priceTwo: 399.99 },
    { _id: 5, priceOne: 400.0, priceTwo: 599.99 },
    { _id: 6, priceOne: 600.0, priceTwo: 1000.0 },
  ];

  const handlePriceClick = (priceRange) => {
    setSelectedPriceRange(priceRange);
    onPriceFilter(priceRange); // Pass the selected range to the parent component
  };

  useEffect(() => {
    if (clearFilters) {
      setSelectedPriceRange(null);
    }
  }, [clearFilters]);

  return (
    <div className="cursor-pointer bg-white rounded-lg shadow-lg p-5 hover:shadow-2xl transition-shadow duration-300">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont mt-4">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-gray-600">
          {priceList.map((item) => (
            <li
              key={item._id}
              onClick={() => handlePriceClick(item)}
              className={`py-3 px-5 rounded-md transition-all duration-300 flex items-center gap-3 cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-gray-900 border-b border-gray-300 
                ${selectedPriceRange?._id === item._id 
                  ? "text-gray-900 border-l-4 border-l-secondary font-semibold" 
                  : "text-gray-700"}`}
            >
              <span className="font-semibold text-lg">
                ${item.priceOne.toFixed(2)} - ${item.priceTwo.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
