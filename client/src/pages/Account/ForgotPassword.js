import React, { useState, useEffect } from "react";
import axios from "axios";
import { PopupMsg } from "../../components/popup/PopupMsg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const validateForm = () => {
    let errors = {};
    if (!email) errors.email = "Email is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });
      if (res.status === 200) {
        setSuccessMsg(res.data.message);
        localStorage.setItem("closeTabAfterReset", "true");
        setPopup({
          message: "Reset Password Link Sent to your Email",
          type: "success",
          show: true,
        });
      }
    } catch (e) {
      console.error("Error", e);
      setPopup({
        message: "Failed to send reset password link. Please try again.",
        type: "error",
        show: true,
      });
    }
  };

  // useEffect(() => {
  //   if (popup.show) {
  //     const timer = setTimeout(() => setPopup({ ...popup, show: false }), 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [popup]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address below to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Your Email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Send Reset Link
          </button>
        </form>
        {successMsg && (
          <p className="text-green-500 text-center mt-4">{successMsg}</p>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/signin"
              className="text-purple-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
