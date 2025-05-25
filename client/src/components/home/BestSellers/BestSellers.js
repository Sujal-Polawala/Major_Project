import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import { API_BASE_URL } from "../../../config/ApiConfig";
import SkeletonCard from "../../../skeletons/productSkeletonCard";

const BestSellers = () => {
  const [bestSellers, setbestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/men`); // Replace with your backend API URL
        setbestSellers(response.data); // Set the fetched data to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new arrival products", error);
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const settings = {
    infinite: true, // Change to false to test
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      <Slider {...settings}>
        {loading
          ? [...Array(4)].map((_, index) => (
              <div key={index} className="px-2">
                <SkeletonCard />
              </div>
            ))
          : bestSellers.map((product) => (
              <div className="px-2" key={product.id}>
                <Product
                  _id={product._id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                  badge={product.badge}
                  des={product.description}
                  category={product.category}
                />
              </div>
            ))}
      </Slider>
    </div>
  );
};

export default BestSellers;
