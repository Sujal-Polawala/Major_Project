import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import { API_BASE_URL } from "../../../config/ApiConfig";
import SkeletonCard from "../../../skeletons/productSkeletonCard";

const NewArrivals = () => {
  const [newArrival, setNewArrival] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/products/glasses`
        );
        setNewArrival(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new arrival products", error);
        setLoading(false);
      }
    };
    fetchNewArrival();
  }, []);

  const settings = {
    arrows: true,
    infinite: newArrival.length > 4,
    speed: 500,
    slidesToShow: newArrival.length < 4 ? newArrival.length : 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: newArrival.length < 3 ? newArrival.length : 3,
          slidesToScroll: 1,
          infinite: newArrival.length > 3,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: newArrival.length < 2 ? newArrival.length : 2,
          slidesToScroll: 1,
          infinite: newArrival.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: newArrival.length > 1,
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
          : newArrival.map((product) => (
              <div className="px-2" key={product._id}>
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

export default NewArrivals;