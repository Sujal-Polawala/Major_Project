import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa";
import NavTitle from "./NavTitle";

const Category = ({ onCategoryFilter, clearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/filters");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (name) => {
    setSelectedCategory(name); // Update selected category
    onCategoryFilter(name); // Call the parent filter function
  };

  // Reset the selected category when filters are cleared
  useEffect(() => {
    if (clearFilters) {
      setSelectedCategory(null);
    }
  }, [clearFilters]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-3 text-sm lg:text-base text-gray-700">
          {categories.map(({ _id, name }) => (
            <li
              key={_id}
              className={`flex items-center justify-between p-3 rounded-md transition-colors duration-300 cursor-pointer ${
                selectedCategory === name
                  ? "bg-primeColor text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => handleCategorySelect(name)}
            >
              <span
                className={`font-medium ${
                  selectedCategory === name
                    ? "text-white"
                    : "text-gray-800 group-hover:text-primeColor"
                }`}
              >
                {name}
              </span>
              <FaChevronRight
                className={`transition-colors duration-300 ${
                  selectedCategory === name
                    ? "text-white"
                    : "text-gray-400 group-hover:text-primeColor"
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;

