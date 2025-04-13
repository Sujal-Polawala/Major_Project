import React from "react";
import { useLocation } from "react-router-dom";
import Heading from "../home/Products/Heading";
import Product from "../home/Products/Product";

const AISearch = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || []; // Retrieve results from state

    return (
        <div className="w-full pb-20">
        <Heading heading="AI Searched Products" />
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
            {searchResults.length === 0 ? (
            <p className="text-gray-500 text-center w-full">No products found. Try uploading a different image.</p>
            ) : (
            searchResults.map((product, index) => (
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

export default AISearch;
