import React from "react";
import ItemCard from "./ItemCard";

const CartList = ({ cartItems, handleDelete, handleQuantityChange }) => (
  <>
    <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
      <h2 className="col-span-2">Product</h2>
      <h2>Price</h2>
      <h2>Quantity</h2>
      <h2>Sub Total</h2>
    </div>
    <div className="mt-5">
      {cartItems.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          handleDelete={handleDelete}
          handleQuantityChange={handleQuantityChange}
        />
      ))}
    </div>
  </>
);

export default CartList;
