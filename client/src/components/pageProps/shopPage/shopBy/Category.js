import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa";
import NavTitle from "./NavTitle";
import { API_BASE_URL } from "../../../../config/ApiConfig";
import ListSkeleton from "../../../../skeletons/listSkeletonCard"; // ✅ Import skeleton

const Category = ({ onCategoryFilter, clearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/filters`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (name) => {
    setSelectedCategory(name);
    onCategoryFilter(name);
  };

  useEffect(() => {
    if (clearFilters) {
      setSelectedCategory(null);
    }
  }, [clearFilters]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        {loading ? (
          <ListSkeleton />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Category;