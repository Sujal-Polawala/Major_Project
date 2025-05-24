import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useOrders from "./useOrders";
import OrderFilter from "./OrderFilter";
import OrderCard from "./OrderCard";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import { PopupMsg } from "../../../components/popup/PopupMsg";

const MyOrder = () => {
  const { state } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  const {
    popup,
    prevLocation,
    filteredOrders,
    filter,
    years,
    handleFilterChange,
    handleSearchTermChange,
  } = useOrders();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200">
            No user logged in.
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-container mx-auto p-4">
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <Breadcrumbs title="MyOrders" prevLocation={prevLocation} />
      <div className="max-w-6xl mx-auto px-6">
        <header className="my-2">
          <h1 className="text-4xl font-extrabold">Your Orders</h1>
        </header>
        <OrderFilter
          orders={filteredOrders}
          filter={filter}
          years={years}
          onSearchChange={handleSearchTermChange}
          onFilterChange={handleFilterChange}
        />
        {filteredOrders.length > 0 ? (
          <div className="space-y-8">
            {filteredOrders.map((order) => (
              <>
                <OrderCard key={order._id} order={order} user={user} />
                <div className={`p-6 rounded-lg`}>
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-center gap-6 mb-4 rounded-lg p-4`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-md"
                      />
                      <div>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyOrder;