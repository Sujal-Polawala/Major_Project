import React from "react";
import SearchOrders from "../SearchOrders";

const OrderFilter = ({ orders, filter, years, onSearchChange, onFilterChange }) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <SearchOrders orders={orders} onSearchChange={onSearchChange} />
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 border rounded-lg shadow-sm bg-white text-gray-700"
      >
        <option value="last 30 days">Last 30 Days</option>
        <option value="past 3 months">Past 3 Months</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
        <option value="Archived Orders">Archived Orders</option>
      </select>
    </div>
  );
};

export default OrderFilter;
