import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/ApiConfig";
import SkeletonRecommendedProduct from "../../../skeletons/productRecommendedSkeletonCard";

const ProductsOnSale = ({ productInfo }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/product/recommendations`,
        {
          params: {
            productId: productInfo._id,
            category: productInfo.category,
          },
        }
      );
      if (response.data.success) {
        setRecommendedProducts(response.data.recommendedProducts);
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productInfo) {
      fetchRecommendedProducts();
    }
  }, [productInfo]);

  return (
    <div className="overflow-hidden">
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        AI Recommended Products
      </h3>

      <div className="flex flex-col gap-2">
        {loading ? (
          // Show 3-4 skeletons
          <>
            <SkeletonRecommendedProduct />
            <SkeletonRecommendedProduct />
            <SkeletonRecommendedProduct />
            <SkeletonRecommendedProduct />
          </>
        ) : recommendedProducts.length > 0 ? (
          recommendedProducts.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition duration-300"
              onClick={() => navigate(`/products/${item._id}`)}
            >
              <div className="w-16 h-18 flex-shrink-0">
                <img
                  className="w-full h-full object-contain rounded-md"
                  src={item.image}
                  alt={item.title}
                />
              </div>
              <div className="flex flex-col justify-center flex-grow">
                <p className="text-base font-medium truncate sm:w-[200px] w-[100px]">
                  {`${item.title.slice(0, 10)}...`}
                </p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  ${item.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsOnSale;
