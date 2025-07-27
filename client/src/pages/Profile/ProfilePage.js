import React from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const ProfilePage = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/profile/myaccount", label: "My Account" },
    { path: "/profile/myorders", label: "My Orders" },
  ];

  const cards = [
    {
      title: "My Account",
      description:
        "Update your personal information and secure your account settings.",
      to: "/profile/myaccount",
    },
    {
      title: "My Orders",
      description:
        "Track your orders, view history, and manage return requests.",
      to: "/profile/myorders",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-gray-800 px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <Breadcrumbs title="Profile Page" prevLocation="/" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-1/4 w-full bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-cyan-600 uppercase tracking-wide mb-6">
            Dashboard
          </h2>
          <ul className="space-y-4">
            {navLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-cyan-600 text-white shadow"
                        : "hover:bg-cyan-100 text-gray-700"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <section className="md:w-3/4 w-full bg-white/90 backdrop-blur-md rounded-xl p-6 md:p-10 shadow-md animate-fade-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">
            Access your profile and manage your preferences with ease.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map(({ title, description, to }) => (
              <div
                key={title}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-cyan-700">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
                <Link
                  to={to}
                  className="inline-block text-sm text-cyan-600 hover:text-purple-600 font-semibold transition"
                >
                  Go to {title} →
                </Link>
              </div>
            ))}
          </div>
        </section>
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
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
