import React, { useState, useEffect, useRef } from "react";

function SearchOrders({ orders, onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  const searchBoxRef = useRef(null); // Reference for the search box container

  useEffect(() => {
    // const allSuggestions = orders.flatMap((order) =>
    //   order.items.map((item) => item.title)
    // );
    // setSuggestions([...new Set(allSuggestions)]);
  }, [orders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setFilteredSuggestions([]); // Hide suggestions when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event) => {
    const input = event.target.value;
    setSearchTerm(input);

    if (input.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }

    onSearchChange(input); // Update search term in parent
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setFilteredSuggestions([]);
    onSearchChange(suggestion); // Trigger search with selected suggestion
  };

  return (
    <div className="relative" ref={searchBoxRef}>
      <input
        type="text"
        placeholder="Search orders..."
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setFilteredSuggestions(suggestions)}
        className="border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 w-64"
      />

      {filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchOrders;