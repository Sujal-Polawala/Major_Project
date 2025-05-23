// src/components/.../ListSkeleton.jsx
import React from "react";

const ListSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-10 w-full bg-gray-200 rounded-md animate-pulse"
        />
      ))}
    </div>
  );
};

export default ListSkeleton;
