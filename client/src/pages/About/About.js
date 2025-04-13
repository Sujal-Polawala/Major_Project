import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Member1 from "../../assets/audit-client.png"
import Member2 from "../../assets/images.jpg"

const AboutPage = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  return (
    <div className="bg-white min-h-screen p-4 text-gray-800">
      <Breadcrumbs title="About Us" prevLocation={prevLocation} />
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold">About Our Store</h1>
        <p className="text-lg mt-4 max-w-3xl mx-auto">
          Your one-stop destination for quality products, seamless shopping, and
          excellent customer service.
        </p>
      </motion.div>

      {/* Our Mission & Vision */}
      <motion.div
        className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold">Our Mission & Vision</h2>
        <p className="mt-4 text-gray-600">
          We strive to bring the best products to your doorstep with an easy and
          reliable shopping experience. Our goal is to create a trusted
          community of buyers and sellers worldwide.
        </p>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 p-6 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Meet Our Team */}
      <motion.div className="mt-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamData.map((member, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 mx-auto rounded-full mb-4 border-4 border-gray-300"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Customer Reviews */}
      <motion.div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 italic">"{review.text}"</p>
              <h4 className="font-semibold mt-4">- {review.author}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const features = [
  {
    title: "Fast & Secure Shipping",
    description: "We ensure quick delivery with secure packaging.",
  },
  {
    title: "Quality Assurance",
    description: "Every product is tested for quality before shipment.",
  },
  {
    title: "24/7 Customer Support",
    description: "Our team is here to help you at any time.",
  },
];

const teamData = [
  {
    name: "Alice Johnson",
    role: "CEO",
    image: Member1,
  },
  {
    name: "Mark Wilson",
    role: "CTO",
    image: Member2,
  },
  {
    name: "Emice Brown",
    role: "Marketing Head",
    image: Member1,
  },
];

const reviews = [
  { text: "Amazing quality and service!", author: "John Doe" },
  { text: "Fast delivery and great support.", author: "Jane Smith" },
];

export default AboutPage;
