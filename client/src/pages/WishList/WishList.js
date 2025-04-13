import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setWishlist } from "../../redux/orebiSlice";
import { PopupMsg } from "../../components/popup/PopupMsg";

function WishList() {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const dispatch = useDispatch();

  const wishlistProducts = useSelector(
    (state) => state.orebiReducer?.wishlistProducts
  );
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    if (!user?.userId) return; // Ensure user exists before fetching

    setLoading(true);
    axios
      .get(`http://localhost:5000/wishlist/${user.userId}`)
      .then((response) => {
        dispatch(setWishlist(response.data.wishlist)); // Store products in Redux
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
        setLoading(false);
      });
  }, [user]); // Re-run only when `user` changes

  // ✅ Remove Product from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/wishlist/remove`,
        {
          userId: user?.userId, // Ensure `userId` is available
          productId,
        }
      );

      if (response.data.success) {
        const updatedWishlist = wishlistProducts.filter(
          (p) => p._id !== productId
        );
        dispatch(setWishlist(updatedWishlist)); // Update Redux store
        setPopup({
          message: "Product removed from wishlist",
          type: "success",
          show: true,
        });
      }
    } catch (error) {
      console.error(
        "Error removing from wishlist:",
        error.response?.data || error.message
      );
      setPopup({
        message: "Error removing from wishlist",
        type: "error",
        show: true,
      });
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 mb-2">
      <Breadcrumbs title="Wish List Product" />
      <h2 className="text-2xl font-semibold mb-6">Your Wishlist</h2>
      {popup.show && <PopupMsg type={popup.type} message={popup.message} />}

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : wishlistProducts.length === 0 ? (
        <p className="text-center text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow-md relative"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-44 object-contain rounded-md"
                />
                <h3 className="text-lg font-semibold mt-2">{`${product.title.slice(
                  0,
                  20
                )}...`}</h3>
                <p className="text-gray-600">${product.price}</p>
              </Link>

              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;
