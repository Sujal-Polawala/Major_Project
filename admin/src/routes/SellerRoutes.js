import { lazy } from "react";
import Loadable from "ui-component/Loadable";
import MainLayout from "layout/MainLayout";
import UserProfile from "component/Profile";
import AccountSettings from "component/AccountSetting";

// Lazy-loaded seller pages
const SellerDashboard = Loadable(lazy(() => import("views/pages/seller/dashboard")));
const ProductList = Loadable(lazy(() => import("views/pages/seller/productList")));
const OrderList = Loadable(lazy(() => import("views/pages/seller/orderList")));
const SamplePage = Loadable(lazy(() => import("views/sample-page")));

const SellerRoutes = {
  path: "/seller",
  element: <MainLayout />, // Main layout for seller routes
  children: [
    { path: "dashboard", element: <SellerDashboard /> },
    { path: "product-list", element: <ProductList /> },
    { path: "order-list", element: <OrderList /> },
    { path: "sample-page", element: <SamplePage /> },
    {path : "profile" , element: <UserProfile/>},
    {path: "account-setting", element: <AccountSettings/>}

  ]
};

export default SellerRoutes;
