import React, { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";

const Breadcrumbs = ({ prevLocation, title }) => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter((segment) => segment);
    setBreadcrumbs(pathSegments);
  }, [location]);

  return (
    <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
      <h1 className="text-5xl text-primeColor font-titleFont font-bold">
        {title}
      </h1>
      <p className="text-sm font-normal text-lightText capitalize flex items-center">
        <span>{prevLocation === "" ? "Home" : prevLocation}</span>
        {breadcrumbs.map((segment, index) => (
          <React.Fragment key={index}>
            <span className="px-1">
              <HiOutlineChevronRight />
            </span>
            <span
              className={`capitalize font-semibold ${
                index === breadcrumbs.length - 1 ? "text-primeColor" : ""
              }`}
            >
              {segment}
            </span>
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default Breadcrumbs;
