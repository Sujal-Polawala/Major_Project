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
    <div className="min-h-screen max-w-container mx-auto p-4 sm:p-6 bg-gray-50 text-gray-100 font-sans">
      <Breadcrumbs title="Profile Page" prevLocation={prevLocation} />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
        <h1
          className="text-3xl sm:text-5xl font-extrabold mb-10 sm:mb-14
            text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600
            animate-fade-slide-up"
        >
          Your Profile Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          {/* Sidebar */}
          <aside
            className="w-full md:w-1/4 bg-gray-900 border border-gray-700 rounded-3xl shadow-lg p-4 sm:p-6
            backdrop-blur-sm bg-opacity-40"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-widest uppercase text-cyan-400 drop-shadow-lg">
              Navigation
            </h2>
            <ul className="space-y-5 sm:space-y-6">
              {[
                { path: "/profile/myaccount", label: "My Account" },
                { path: "/profile/myorders", label: "My Orders" },
              ].map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`block py-3 px-5 sm:px-6 rounded-xl text-lg sm:text-base font-semibold
                        transition-all duration-300 relative
                        ${isActive
                          ? "text-cyan-400 bg-gray-800 shadow-lg"
                          : "text-gray-400 hover:text-cyan-300 hover:bg-gray-800 hover:shadow-md"
                        }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Content */}
          <section
            className="w-full md:w-3/4 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-3xl shadow-lg p-6 sm:p-10
            backdrop-blur-lg
            animate-fade-slide-up delay-150"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 tracking-wide text-gradient from-cyan-300 to-purple-600">
              Welcome Back!
            </h2>
            <p className="text-gray-300 mb-8 sm:mb-12 text-base sm:text-lg max-w-xl">
              Explore your account settings, track your orders, and manage your preferences seamlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
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
                  className="group relative rounded-3xl border border-gray-700 p-6 sm:p-8 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md
                    hover:shadow-2xl transition-shadow duration-500 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-30 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 blur-lg group-hover:opacity-60 transition-opacity duration-500"></div>

                  <h3 className="relative text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                    {title}
                  </h3>
                  <p className="relative text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">{description}</p>
                  <Link
                    to={to}
                    className="relative text-cyan-400 font-semibold hover:text-purple-500 transition-colors text-sm sm:text-base"
                  >
                    Go to {title} →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.8s ease forwards;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(90deg, #22d3ee, #818cf8, #a78bfa);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
