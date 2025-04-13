import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const ContactUs = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent successfully!");
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <Breadcrumbs title="Contact Us" prevLocation={prevLocation} />
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-600 mt-2">We would love to hear from you!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Contact Form */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            ></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-5 bg-gray-50 rounded-lg shadow-md">
            <FaPhoneAlt className="text-blue-600 text-xl" />
            <p className="text-gray-800">+91 98765 43210</p>
          </div>
          <div className="flex items-center space-x-4 p-5 bg-gray-50 rounded-lg shadow-md">
            <FaEnvelope className="text-blue-600 text-xl" />
            <p className="text-gray-800">styleverse81@gmail.com</p>
          </div>
          <div className="flex items-center space-x-4 p-5 bg-gray-50 rounded-lg shadow-md">
            <FaMapMarkerAlt className="text-blue-600 text-xl" />
            <p className="text-gray-800">Gujarat, India</p>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-10 w-full h-80">
        <iframe
          title="Google Map"
          className="w-full h-full rounded-lg shadow-md"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29400404.183848694!2d70.57903405534944!3d22.258652632178297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959a7aa6a1f67db%3A0x6f2b2b1c1e6c91e0!2sGujarat!5e0!3m2!1sen!2sin!4v1698412345678!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
