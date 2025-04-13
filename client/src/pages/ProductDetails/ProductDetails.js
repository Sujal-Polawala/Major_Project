import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState({});
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        console.log("Fetched Product:", response.data);
        setProductInfo(response.data);

        // Check if front image exists, otherwise fallback to product.image
        const frontImage = response.data.images?.find((image) => image.type === "front")?.url;
        setMainImage(frontImage || response.data.image); // Use front image if available, else fallback to product.image
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="Product Description" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            <ProductsOnSale productInfo={productInfo}/>
          </div>
          <div className="h-full xl:col-span-2 flex justify-center items-center">
            {/* Display Main Product Image with Hover Zoom Effect */}
            {mainImage && (
              <div className="relative group w-full max-w-md mx-auto">
                <img
                  className="w-full max-h-96 object-contain rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform group-hover:scale-110"
                  src={mainImage}
                  alt="Product Main"
                />
              </div>
            )}
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            {/* Product Description */}
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
