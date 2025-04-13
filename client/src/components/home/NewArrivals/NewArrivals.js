import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const [newArrival, setNewArrival] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/glasses"
        ); // Replace with your backend API URL
        setNewArrival(response.data); // Set the fetched data to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new arrival products", error);
        setLoading(false);
      }
    };
    fetchNewArrival();
  }, []);

  const settings = {
    infinite: false, // Change to false to test
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
          slidesToScroll: 2,
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
        {loading ? (
          <div>Loading...</div>
        ) : (
          newArrival.map((product) => (
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
          ))
        )}
      </Slider>
    </div>
  );
};

export default NewArrivals;
