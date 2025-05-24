import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/ApiConfig";

const InvoiceDropdown = ({ orderId, dropdownOpen, toggleDropdown }) => {
  const [loading, setLoading] = useState(false);

  const downloadInvoice = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/invoice/${orderId}`, { responseType: "blob" });
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

  const emailInvoice = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/orders/invoice/email/${orderId}`);
      alert("Invoice sent to your email.");
    } catch (error) {
      console.error("Email error:", error);
    }
  };

  return (
    <div className="relative mt-2">
      <button onClick={toggleDropdown} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Invoice ▼
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-md w-40">
          <button onClick={downloadInvoice} className="block w-full px-4 py-2 hover:bg-gray-100">Download Invoice</button>
          <button onClick={emailInvoice} className="block w-full px-4 py-2 hover:bg-gray-100">Email Invoice</button>
        </div>
      )}
    </div>
  );
};

export default InvoiceDropdown;
