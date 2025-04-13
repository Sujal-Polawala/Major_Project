import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { HiOutlineMail, HiUser, HiPencilAlt } from "react-icons/hi";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import AddressForm from "../Address/AddressForm";
import { PopupMsg } from "../../components/popup/PopupMsg";

const MyAccount = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const { state } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  const [userDetails, setUserDetails] = useState(null);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobileno: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const userId = user?.userId;
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && userId) {
        try {
          const userResponse = await axios.get(
            `http://localhost:5000/api/user/${userId}`
          );
          setUserDetails(userResponse.data);
          if (userResponse.data?.address) {
            setAddress(userResponse.data.address);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [isLoggedIn, userId]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID is missing.");
      return;
    }
    const { address: addr, city, state, pincode, country, mobileno } = address;
    if (!addr || !city || !state || !pincode || !country || !mobileno) {
      alert("All fields are required.");
      return;
    }
    try {
      const apiUrl = userDetails?.address
        ? `http://localhost:5000/api/user/update-address/${userId}`
        : `http://localhost:5000/api/user/add-address/${userId}`;
      const method = userDetails?.address ? "PUT" : "POST";
      const response = await axios({
        url: apiUrl,
        method: method,
        headers: { "Content-Type": "application/json" },
        data: { address },
      });
      setPopup({
        message: userDetails?.address
          ? "Address updated successfully!"
          : "Address added successfully!",
        type: "success",
        show: true,
      });
      setUserDetails(response.data.user);
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error("Error processing address:", error);
      setPopup({
        message: "Failed to update address. Please try again later.",
        type: "error",
        show: true,
      });
    }
  };

  const handleCancelUpdate = () => {
    setIsEditing(false);
    if (userDetails?.address) {
      setAddress(userDetails.address);
    }
  };

  const resetForm = () => {
    setAddress({
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      mobileno: "",
    });
  };

  return (
    <div className="min-h-screen max-w-container flex flex-col items-center justify-center mx-auto p-4">
      <Breadcrumbs title="My Account" prevLocation={prevLocation} />
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg p-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Your Account
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your account and orders
          </p>
        </div>

        {/* User Details Section */}
        <div className="space-y-8">
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              User Details
            </h2>
            <div className="mt-4 space-y-2">
              <p className="flex items-center text-gray-700">
                <HiUser className="mr-2 text-indigo-600" />
                <strong>Name:</strong> {userDetails?.firstname}{" "}
                {userDetails?.lastname}
              </p>
              <p className="flex items-center text-gray-700">
                <HiOutlineMail className="mr-2 text-indigo-600" />
                <strong>Email:</strong> {userDetails?.email}
              </p>
              <p className="flex items-center text-gray-700">
                <strong>Username:</strong> {userDetails?.username}
              </p>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-6">
            {userDetails?.address && !isEditing ? (
              <div className="bg-indigo-50 p-6 rounded-lg shadow-md mt-6 relative">
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Saved Address
                </h2>
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-indigo-700"
                  onClick={() => setIsEditing(true)}
                >
                  <HiPencilAlt size={20} />
                </button>
                <p><strong>Address:</strong> {userDetails.address.address}</p>
                <p><strong>City:</strong> {userDetails.address.city}</p>
                <p><strong>State:</strong> {userDetails.address.state}</p>
                <p><strong>Pincode:</strong> {userDetails.address.pincode}</p>
                <p><strong>Country:</strong> {userDetails.address.country}</p>
                <p><strong>Mobile No:</strong> {userDetails.address.mobileno}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-700">
                  {userDetails?.address ? "Update Address" : "Add Address"}
                </h2>
                <AddressForm
                  address={address}
                  handleAddressChange={handleAddressChange}
                  handleAddressSubmit={handleAddressSubmit}
                  userDetails={userDetails}
                />
                {isEditing && (
                  <button
                    onClick={handleCancelUpdate}
                    className="mt-4 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
