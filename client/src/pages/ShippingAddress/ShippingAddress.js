import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from "../../context/AuthContext";
import { PopupMsg } from "../../components/popup/PopupMsg";

const stripePromise = loadStripe(
  "pk_test_51QYRRtKgiwXQrp00vZiyMntCEv4VM66zASx94cI9qK7T5eMVUnPeys4CSfmIHdPLprOn2zHKE4H1Cf7AWdB9ZEBA00R8j7T7xo"
);

const ShippingAddress = ({ cartItems, totalPrice, clearCart, discount }) => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const userId = user.userId;

  // console.log("Discount:", discount);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobileno: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
const [shippingCharge, setShippingCharge] = useState(0);

  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${userId}`
        );
        if (response.data?.address) {
          setShippingAddress(response.data.address);
          setIsUpdating(true);
        }
      } catch (error) {
        console.error("Error fetching shipping address:", error);
      }
    };

    if (userId) fetchShippingAddress();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is missing.");
      return;
    }

    const { address, city, state, pincode, mobileno } = shippingAddress;
    if (!address || !city || !state || !pincode || !mobileno) {
      alert("All fields are required.");
      return;
    }

    try {
      const apiUrl = isUpdating
        ? `http://localhost:5000/api/user/update-address/${userId}`
        : `http://localhost:5000/api/user/add-address/${userId}`;
      const method = isUpdating ? "PUT" : "POST";

      await axios({
        url: apiUrl,
        method: method,
        headers: { "Content-Type": "application/json" },
        data: { address: shippingAddress },
      });

      setPopup({
        message: isUpdating
          ? "Shipping address updated successfully!"
          : "Shipping address added successfully!",
        type: "success",
        show: true,
      });
      setIsUpdating(true);
    } catch (error) {
      console.error("Error saving address:", error);
      setPopup({
        message: "Failed to save shipping address. Please try again.",
        type: "error",
        show: true,
      });
    }
  };

  useEffect(() => {
    if (totalPrice) {
      setShippingCharge(5);
    }
  }, [totalPrice]);

totalPrice = Number(totalPrice) + Number(shippingCharge);

  console.log("Total Price:", totalPrice);

  const finalPrice = totalPrice;

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      // Create payment session
      const stripeResponse = await axios.post(
        "http://localhost:5000/api/create-payment",
        {
          userId,
          products: cartItems,
          paymentMethod: "Visa",
          discount,
          totalPrice: finalPrice,
          shippingAddress,
        }
      );

      const { sessionId, paymentId } = stripeResponse.data;
      
      // Finalize payment
      await axios.post("http://localhost:5000/api/finalize-payment", {
        sessionId: sessionId,
      });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error during payment or order placement:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup({ ...popup, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        Shipping Address
      </h2>
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <form onSubmit={handleSaveAddress} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-600"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={shippingAddress.address}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-600"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-600"
            >
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={shippingAddress.state}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-600"
            >
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={shippingAddress.country}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-600"
            >
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              value={shippingAddress.pincode}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
            >
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileno"
              id="mobileno"
              value={shippingAddress.mobileno}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
        >
          Save Address
        </button>
      </form>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Order Summary
        </h2>
        <div className="flex justify-between items-center text-lg font-medium">
          <span>Total Price:</span>
          <span>
            ${cartItems ? (totalPrice).toFixed(2) : 0}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="mt-6 w-full py-3 px-6 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default ShippingAddress;
