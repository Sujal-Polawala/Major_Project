import React, { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaCaretDown,
  FaShoppingCart,
  FaSignOutAlt,
  FaBox,
  FaSignInAlt,
  FaMicrophone,
  FaUserPlus,
  FaCamera,
  FaHeart,
} from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Fuse from "fuse.js";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { useDispatch, useSelector } from "react-redux";
import { resetWishlist } from "../../../redux/orebiSlice";
import ProductSearch from "../../AiProductSearch/productSearch";

const HeaderBottom = ({setSearchResults}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  const [cartCount, setCartCount] = useState(0);
  const userId = user?.userId;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const recognitionRef = useRef(null);
  const [isSearchModalOpen , setIsSearchModalOpen] = useState(false);
  // const [imagePreview, setImagePreview] = useState(null);
  const avatarRef = useRef(null);
  const searchDropdownRef = useRef(null); // Ref for dropdown
  const dispatchh = useDispatch();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setFilteredProducts([]);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatchh(resetWishlist())
    dispatch({
      type: "LOGOUT",
    });
    navigate("/signin");
  };

  // Handle voice search to work with categories as well
  const handleVoiceSearch = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Chrome!");
      return;
    }
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
  
    recognition.onstart = () => {
      setIsListening(true);
      console.log("Voice recognition started...");
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setSearchQuery(transcript);
      console.log("Recognized:", transcript);
  
      // Perform search with voice input
      const productResults = fuse.search(transcript).map((result) => result.item);
      setFilteredProducts(productResults);
  
      setIsListening(false);
    };
  
    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setIsListening(false);
    };
  
    recognition.onend = () => {
      setIsListening(false);
      console.log("Voice recognition ended.");
    };
  
    recognition.start();
  };

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/count/${userId}`
      );
      setCartCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userId) {
        fetchCartCount();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [userId]);

  const fuse = new Fuse(allProducts, {
    keys: ["title", "category"],  // Now searching in both title and category
    includeScore: true,
    threshold: 0.3, 
  });

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchQuery(inputValue);
  
    if (inputValue === "") {
      setFilteredProducts([]);
      setSuggestedWords([]);
      return;
    }
  
    // Searching in both title and category
    const productResults = fuse.search(inputValue).map((result) => result.item);
    setFilteredProducts(productResults);
  
    // Matching titles and categories for suggestions
    const matchingSuggestions = allProducts
      .map((product) => product.title)
      .concat(allProducts.map((product) => product.category)) // Include categories in suggestions
      .filter((text) => text.toLowerCase().includes(inputValue));
  
    setSuggestedWords([...new Set(matchingSuggestions)].slice(0, 5));
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestedWords.length > 0) {
      const selectedWord = suggestedWords[0];
      setSearchQuery(selectedWord);
      setFilteredProducts(fuse.search(selectedWord).map((result) => result.item));
      setSuggestedWords([]);
    }
  };

  useEffect(() => {
    const filtered = allProducts.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div className="relative w-full lg:w-[700px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
          <div className="relative flex-1 h-full">
            {/* Ghost Text (Positioned Behind) */}
            {/* {suggestedWords.length > 0 && searchQuery && (
              <span className="absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-300 select-none pointer-events-none w-full truncate">
                {searchQuery}
                <span className="text-gray-200">
                  {suggestedWords[0]?.slice(searchQuery.length)}
                </span>
              </span>
            )} */}

            {/* Input Field */}
            <input
              className="absolute w-full h-full outline-none bg-transparent placeholder:text-[#C4C4C4] placeholder:text-[14px] text-black z-10"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              onKeyDown={handleKeyDown}
              placeholder="Search your products here"
            />
          </div>
            <FaSearch className="w-5 h-5" />
            <div className="relative">
              <FaMicrophone 
                className={`w-5 h-5 cursor-pointer transition-all ${
                  isListening ? "text-red-500 animate-pulse" : "text-blue-500"
                }`} 
                onClick={handleVoiceSearch}
              />
              {isListening && (
                <motion.div 
                  className="absolute top-0 left-0 transform -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full opacity-50"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </div>
            {/* <label htmlFor="file-upload" className="cursor-pointer">
              <FaCamera className="w-5 h-5 text-gray-500" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            /> */}
            {(searchQuery.trim() !== "" ) && (
                <div
                ref={searchDropdownRef} // Add ref here
                className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer"
              >
                {/* Close Button */}
                <div className="flex justify-end p-2">
                  <button
                    onClick={() => {
                      setFilteredProducts([]);
                      setFilteredProducts([]);
                      setSearchQuery("");
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Close
                  </button>
                </div>
                {filteredProducts.map((item) => (
                  <div
                    onClick={() =>
                      navigate(
                        `/products/${item._id
                          .toLowerCase()
                          .split(" ")
                          .join("")}`,
                        {
                          state: {
                            item: item,
                          },
                        }
                      ) & setSearchQuery("") & setFilteredProducts([])
                    }
                    key={item._id}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={item.image} alt="productImg" />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.title}</p>
                      <p className="text-xs">{item.description}</p>
                      <p className="text-sm">
                        Price:{" "}
                        <span className="text-primeColor font-semibold">
                          ${item.price}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-start w-full mt-2 ml-2 lg:mt-0">
            <button
            onClick={() => setIsSearchModalOpen(true)}
            className="bg-black font-semibold rounded-md text-white px-3 py-2">
              Search By Image
            </button>
          </div>
          
          {isSearchModalOpen && <ProductSearch close={() => setIsSearchModalOpen(false)} setSearchResults={setSearchResults} />}

          <div className="flex gap-4 mt-2 ml-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div className="relative">
              <div
                ref={avatarRef}
                className="flex items-center cursor-pointer space-x-2"
                onClick={toggleDropdown}
              >
                <div
                  className={`${
                    isLoggedIn
                      ? "bg-black text-white"
                      : "bg-gray-400 text-gray-800"
                  } rounded-full w-10 h-10 flex items-center justify-center text-lg uppercase`}
                >
                  {isLoggedIn && user?.username ? user.username.charAt(0) : "G"}
                </div>
              </div>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 
                    w-56 sm:w-48 lg:w-56 lg:right-5 left-1/2 transform -translate-x-1/2 sm:left-auto sm:translate-x-0 
                    overflow-hidden"
                >
                  <div className="px-4 py-4">
                    <h3 className="font-bold text-base text-gray-800 border-b pb-2">
                      Your Account
                    </h3>
                    {user ? (
                      <motion.ul
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 pt-4"
                      >
                        <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer transition-all duration-300">
                          <FaUser className="mr-3 text-lg text-blue-500" />
                          <Link
                            to="/profile/myaccount"
                            className="text-sm font-medium"
                          >
                            Your Account
                          </Link>
                        </li>
                        <li className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer transition-all duration-300">
                          <FaBox className="mr-3 text-lg text-green-500" />
                          <Link
                            to="/profile/myorders"
                            className="text-sm font-medium"
                          >
                            Your Orders
                          </Link>
                        </li>
                        <li className="flex items-center text-gray-600 hover:text-red-600 cursor-pointer transition-all duration-300">
                          <FaSignOutAlt className="mr-3 text-lg text-red-500" />
                          <button
                            onClick={handleLogout}
                            className="text-sm font-medium focus:outline-none"
                          >
                            Sign Out
                          </button>
                        </li>
                      </motion.ul>
                    ) : (
                      <motion.ul
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 pt-4"
                      >
                        <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer transition-all duration-300">
                          <FaSignInAlt className="mr-3 text-lg text-blue-500" />
                          <Link to="/signin" className="text-sm font-medium">
                            Sign In
                          </Link>
                        </li>
                        <li className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer transition-all duration-300">
                          <FaUserPlus className="mr-3 text-lg text-green-500" />
                          <Link to="/signup" className="text-sm font-medium">
                            Sign Up
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/wishlist">
              <div className="relative">
                <FaHeart />
              </div>
            </Link>
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {cartCount}
                </span>
              </div>
            </Link>
            
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;