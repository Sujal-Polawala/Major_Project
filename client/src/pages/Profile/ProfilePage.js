import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const ProfilePage = () => {
  const [prevLocation, setPrevLocation] = useState("");
  const location = useLocation();

  useEffect(() => {
    setPrevLocation(document.referrer || "");
  }, []);

  return (
    <div className="min-h-screen max-w-container mx-auto p-4 sm:p-6 bg-gray-100 text-gray-800 font-sans">
      <Breadcrumbs title="Profile Page" prevLocation={prevLocation} />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">
          Your Profile Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-blue-600">
              Navigation
            </h2>
            <ul className="space-y-4">
              {[
                { path: "/profile/myaccount", label: "My Account" },
                { path: "/profile/myorders", label: "My Orders" },
              ].map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`block py-2 px-4 rounded-lg font-medium
                    ${
                      isActive
                        ? "text-blue-600 bg-blue-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Content */}
          <section className="w-full md:w-3/4 bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-2xl">
              Explore your account settings, track your orders, and manage your
              preferences seamlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "My Account",
                  description:
                    "Manage your personal details, update your profile, and secure your account.",
                  to: "/profile/myaccount",
                },
                {
                  title: "My Orders",
                  description:
                    "View your order history, track your purchases, and manage returns effortlessly.",
                  to: "/profile/myorders",
                },
              ].map(({ title, description, to }) => (
                <div
                  key={title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 hover:shadow-md transition duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{description}</p>
                  <Link
                    to={to}
                    className="text-blue-600 font-medium text-sm hover:underline"
                  >
                    Go to {title} →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
