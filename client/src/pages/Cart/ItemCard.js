import React from "react";
import { ImCross } from "react-icons/im";

const ItemCard = ({ item, handleDelete, handleQuantityChange }) => {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.productId, "decrement");
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(item.productId, "increment");
  };

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      {/* Product Info */}
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => handleDelete(item._id)}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img className="w-32 h-32" src={item.image} alt={item.title} />
        <h1 className="font-titleFont font-semibold">{item.title}</h1>
      </div>

      {/* Quantity and Price */}
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        {/* Price */}
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${item.price}
        </div>

        {/* Quantity Controls */}
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={handleDecrement}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300"
          >
            -
          </span>
          <p>{item.quantity}</p>
          <span
            onClick={handleIncrement}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300"
          >
            +
          </span>
        </div>

        {/* Total */}
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <p>${(item.quantity * item.price).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
