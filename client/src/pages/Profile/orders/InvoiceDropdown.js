import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/ApiConfig";
import { PopupMsg } from "../../../components/popup/PopupMsg";

const InvoiceDropdown = ({ orderId }) => {
  const [loading, setLoading] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  const handleInvoiceClick = (orderId) => {
    setDropdownOpen((prev) => (prev === orderId ? null : orderId));
    setLoading(orderId);
    setTimeout(() => {
      setLoading(null);
    }, 1000); // Simulate loading delay
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/invoice/${orderId}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const emailInvoice = async (orderId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/orders/invoice/email/${orderId}`);
      setPopup({
        message: "Invoice Has Sent to Your Email Address",
        type: "success",
        show: true,
      });
    } catch (error) {
      console.error("Email error:", error);
      setPopup({
        message: "Failed to send invoice email. Please try again.",
        type: "error",
        show: true,
      });
    }
  };

  return (
    <div className="relative">
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <button
        onClick={() => handleInvoiceClick(orderId)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Invoice ▼
      </button>

      {dropdownOpen === orderId && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-32 z-50 text-zinc-700">
          {loading === orderId ? (
            <div className="flex justify-center items-center py-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 000 8H4z"
                />
              </svg>
            </div>
          ) : (
            <>
              <button
                onClick={() => downloadInvoice(orderId)}
                className="block w-full px-4 py-2 hover:bg-gray-100"
              >
                Download Invoice
              </button>
              <button
                onClick={() => emailInvoice(orderId)}
                className="block w-full px-4 py-2 hover:bg-gray-100"
              >
                Email Invoice
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceDropdown;
