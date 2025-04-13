import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const ProfilePage = () => {
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState("");
  return (
    <div className="min-h-screen max-w-container mx-auto p-4">
        <Breadcrumbs title="Profile Page" prevLocation={prevLocation} />
      <div className="max-w-7xl mx-auto px-2 py-2">
        {/* <h1 className="text-4xl font-bold text-center mb-10">Profile Page</h1> */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Navigation</h2>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/profile/myaccount"
                  className="block py-3 px-4 bg-gray-100 hover:bg-gray-300 text-gray-700 rounded-xl transition"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/myorders"
                  className="block py-3 px-4 bg-gray-100 hover:bg-gray-300 text-gray-700 rounded-xl transition"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </aside>

          {/* Right Content */}
          <section className="w-full md:w-3/4 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8">Welcome Back!</h2>
            <p className="text-lg text-gray-600 mb-10">
              Explore your account settings, track your orders, and manage your preferences seamlessly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-4">My Account</h3>
                <p className="text-gray-500 mb-6">
                  Manage your personal details, update your profile, and secure your account.
                </p>
                <Link
                  to="/profile/myaccount"
                  className="text-blue-600 font-medium hover:text-blue-400 transition"
                >
                  Go to My Account →
                </Link>
              </div>
              <div className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-4">My Orders</h3>
                <p className="text-gray-500 mb-6">
                  View your order history, track your purchases, and manage returns effortlessly.
                </p>
                <Link
                  to="/profile/myorders"
                  className="text-blue-600 font-medium hover:text-blue-400 transition"
                >
                  Go to My Orders →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;