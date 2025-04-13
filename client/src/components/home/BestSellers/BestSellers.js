import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios"; // Import axios for API calls

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]); // State to store bestseller products
  const [loading, setLoading] = useState(true); // Loading state to show a loader while fetching data

  // Fetch the bestseller data when the component mounts
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/men"); // Replace with your backend API URL
        setBestSellers(response.data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching bestseller products", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchBestSellers();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      
      {loading ? (
        <div>Loading...</div> // Show loading text while fetching data
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4">
          {bestSellers.slice(0,4).map((product) => (
            <Product
              key={product.id} // Use product ID as key
              _id={product._id}
              image={product.image} // Replace with the actual image path from the API response
              title={product.title}
              price={product.price}
              badge={product.badge}
              des={product.description}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellers; 