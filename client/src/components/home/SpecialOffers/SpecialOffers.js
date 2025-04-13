import React, {useState, useEffect} from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
// import {
//   spfOne,
//   spfTwo,
//   spfThree,
//   spfFour,
// } from "../../../assets/images/index";
import axios from "axios";

const SpecialOffers = () => {
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    const fetchSpecialOffers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/products/women");
        setSpecialOffers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialOffers();
  }, []);
  return (
    <div className="w-full pb-20">
      <Heading heading="Special Offers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {loading ? (
          <div className="w-full h-20 bg-gray-200 rounded-md animate-pulse"></div>
        ) : (
          specialOffers.slice(0,4).map((product, index) => (
            <Product
              key={index}
              _id={product._id}
              image={product.image}
              title={product.title}
              price={product.price}
              badge={product.badge}
              des={product.description}
              category={product.category}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SpecialOffers;
