import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PopupMsg } from "../../components/popup/PopupMsg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const validateForm = () => {
    let errors = {};
    if (!password) errors.password = "Password is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/reset-password/${id}/${token}`,
        { password }
      );
      if (res.status === 200) {
        setSuccessMsg(res.data.message);
        setPopup({
          message: "Password Reset Successfully",
          type: "success",
          show: true,
        });
        if (localStorage.getItem("closeTabAfterReset") === "true") {
          localStorage.removeItem("closeTabAfterReset");
          window.close(); // Attempts to close the original tab
        }        
      }
    } catch (e) {
      setPopup({
        message: "Failed to reset password. Please try again.",
        type: "error",
        show: true,
      });
      setErrors(e.response?.data?.errors || {});
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
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your new password to reset your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Your Password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Reset Password
          </button>
        </form>
        {successMsg && (
          <p className="text-green-500 text-center mt-4">{successMsg}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
