import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Product from "../../home/Products/Product";

const Pagination = ({ itemsPerPage, selectedBadge, selectedCategory, setSelectedBadge, setSelectedCategory, selectedPriceRange }) => {
  const [items, setItems] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateURLParams = () => {
    const query = new URLSearchParams();
    if (selectedBadge && selectedBadge !== "select") {
      query.append("badge", selectedBadge);
    }
    if (selectedCategory) {
      query.append("category", selectedCategory);
    }

    if (selectedPriceRange) {
      query.append("minPrice", selectedPriceRange.priceOne);
      query.append("maxPrice", selectedPriceRange.priceTwo);
    }
  
    const queryString = query.toString();
    if (queryString) {
      window.history.pushState(null, "", `?${queryString}`);
    } else {
      window.history.pushState(null, "", window.location.pathname); // Remove query string
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(window.location.search);
      if (selectedBadge && selectedBadge !== "select") {
        query.append("badge", selectedBadge);
      }
      if (selectedCategory) {
        query.append("category", selectedCategory);
      }
      if (selectedPriceRange) {
        query.append("minPrice", selectedPriceRange.priceOne);
        query.append("maxPrice", selectedPriceRange.priceTwo);
      }
      const response = await axios.get(
        `http://localhost:5000/api/products?${query.toString()}`
      );
      setItems(response.data);
      setItemOffset(0);
      setCurrentPage(0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
    scrollToTop();
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const badge = query.get("badge");
    const category = query.get("category");

    if (badge) {
      setSelectedBadge(badge);
    } 
    if (category) {
      setSelectedCategory(category);
    } 
    fetchProducts();
  }, []);

  useEffect(() => {
    updateURLParams();
    fetchProducts();
  }, [selectedBadge, selectedCategory, selectedPriceRange]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [items, itemOffset, itemsPerPage]);

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        {loading ? (
          <div>Loading...</div>
        ) : (
          currentItems.map((item) => (
            <div key={item._id} className="w-full">
              <Product
                _id={item._id}
                image={item.image}
                title={item.title}
                price={item.price}
                badge={item.badge}
                des={item.description}
                category={item.category}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination Component */}
      <ReactPaginate
        nextLabel="Next"
        previousLabel="Prev"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        forcePage={currentPage}
        containerClassName="flex items-center justify-center gap-4 mt-6"
        pageLinkClassName="w-10 h-10 flex justify-center items-center border border-gray-300 rounded-full shadow-md text-gray-700 bg-white transition-all duration-300 hover:shadow-lg hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
        activeClassName="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-lg border border-transparent"
        previousClassName="w-10 h-10 flex justify-center items-center border border-gray-300 rounded-full shadow-md text-gray-700 bg-white transition-all duration-300 hover:shadow-lg hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
        nextClassName="w-10 h-10 flex justify-center items-center border border-gray-300 rounded-full shadow-md text-gray-700 bg-white transition-all duration-300 hover:shadow-lg hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
        disabledClassName="opacity-50 cursor-not-allowed pointer-events-none bg-gray-100 border-gray-200 text-gray-400"
        breakLabel="..."
        breakClassName="text-gray-500"
      />

      {/* Page Status */}
      <p className="text-base font-normal text-lightText mt-4 text-center">
        Products from {itemOffset + 1} to{" "}
        {Math.min(itemOffset + itemsPerPage, items.length)} of {items.length}
      </p>
    </div>
  );
};

export default Pagination;