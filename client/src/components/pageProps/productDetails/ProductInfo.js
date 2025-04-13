import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { CartPopup } from "../../popup/PopupMsg";
import { AuthContext } from "../../../context/AuthContext";

const ProductInfo = ({ productInfo }) => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart", {
        productId: productInfo._id,
        quantity: 1,
        userId: user.userId,
      });

      if (response.data.success) {
        dispatch(
          addToCart({
            _id: productInfo._id,
            name: productInfo.title,
            quantity: 1,
            image: productInfo.image,
            badge: productInfo.badge,
            price: productInfo.price,
          })
        );
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (!productInfo) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const rating = productInfo?.rating?.rate ? productInfo.rating : { rate: 0, count: 0 };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-xl shadow-lg">
      {/* Product Title */}
      <h2 className="text-3xl font-bold text-gray-900">{productInfo?.title || "No Title"}</h2>

      {/* Price */}
      <p className="text-2xl font-semibold text-red-600 mt-2">${productInfo?.price || 0}</p>

      {/* Quantity */}
      <p className="text-lg font-medium text-gray-700 mt-2">
        <span className="font-semibold">Available Quantity:</span> {productInfo?.quantity ?? "Not Available"}
      </p>

      {/* Description */}
      <p className="text-gray-700 mt-4 leading-relaxed">
        {productInfo?.description || "No Description Available"}
      </p>

      {/* Categories */}
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-semibold">Category:</span> {productInfo?.category || "N/A"}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full mt-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold text-lg rounded-lg hover:scale-105 transition-all duration-300 shadow-md"
      >
        Add to Cart
      </button>

      {/* Popup Message */}
      {showPopup && <CartPopup productInfo={productInfo} qty={1} setShowPopup={setShowPopup} />}
    </div>
  );
};

export default ProductInfo;
