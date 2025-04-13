import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import VerifyEmail from "./pages/Account/VerifyEmail";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Offer from "./pages/Offer/Offer";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import ShippingAddress from "./pages/ShippingAddress/ShippingAddress";
import SuccessPage from "./pages/Sucess/SuccessPage";
import Shop from "./pages/Shop/Shop";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/Profile/ProfilePage";
import MyAccount from "./pages/Profile/MyAccount";
import MyOrder from "./pages/Profile/MyOrder";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import ForgotPassword from "./pages/Account/ForgotPassword";
import ResetPassword from "./pages/Account/ResetPassword";
import WishList from "./pages/WishList/WishList";
import Aisearch from "./pages/AiSearch/AiSearch";

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/profile/myaccount" element={<MyAccount />}></Route>
        <Route path="/profile/myorders" element={<MyOrder />}></Route>
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/offer" element={<Offer />}></Route>
        <Route path="/payment" element={<ShippingAddress />}></Route>
        <Route path="/success" element={<SuccessPage />}></Route>
        <Route path="/products/:id" element={<ProductDetails />}></Route>
        <Route path="/orders-details/:orderId" element={<OrderDetails />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/wishlist" element={<WishList />}></Route>
        <Route path="/aisearch" element={<Aisearch />} />
        {/* <Route path="/paymentgateway" element={<Payment />}></Route> */}
      </Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/verify-email" element={<VerifyEmail />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/reset-password/:id/:token" element={<ResetPassword />}></Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <div className="font-bodyFont">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
