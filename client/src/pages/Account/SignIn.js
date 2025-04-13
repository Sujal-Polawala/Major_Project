import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoLight } from "../../assets/images";
import { PopupMsg } from "../../components/popup/PopupMsg";
import CryptoJS from "crypto-js";
import { secretKey } from "../../index";

const SignIn = () => {
  const { state, dispatch } = useContext(AuthContext); // Get user from context
  const user = state?.user;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [isUserExist, setIsUserExist] = useState(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [lockTime, setLockTime] = useState(null); // Lock duration in minutes
  const [canLoginAgain, setCanLoginAgain] = useState(true); // Track login status
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });
  const [failedAttempts, setFailedAttempts] = useState(0); // Track failed login attempts
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false); // Tracks login attempts
  const secret_Key = `${secretKey}`;

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedEncryptedPassword = localStorage.getItem("rememberedPassword");

    if (storedUsername && storedEncryptedPassword) {
      setUsername(storedUsername);
      const decryptedBytes = CryptoJS.AES.decrypt(
        storedEncryptedPassword,
        secret_Key
      );
      const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

      setPassword(decryptedPassword);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    let errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setHasAttemptedLogin(true);

    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (res.status === 200 && (res.data.token || res.data.username)) {
        setIsUserExist(true);
        const userData = {
          user: res.data,
          token: res.data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({
          type: "LOGIN",
          payload: userData,
        });

        if (rememberMe) {
          const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            secret_Key
          ).toString();
          localStorage.setItem("rememberedUsername", username);
          localStorage.setItem("rememberedPassword", encryptedPassword);
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
        }
        setPopup({
          message: "Login successful",
          type: "success",
          show: true,
        });

        setTimeout(() => {
          navigate("/", { replace: true }); // Use replace to clear history
        }, 1000);

        // Reset failed attempts on successful login
        setFailedAttempts(0);
      }
    } catch (error) {
      setIsUserExist(false);

      // Check if the user is blocked
      if (
        error.response &&
        error.response.data.message ===
          "Your account has been blocked. Please contact support."
      ) {
        setPopup({
          message: "Your account has been blocked. Please contact support.",
          type: "error",
          show: true,
        });
        return;
      }

      // Increment failed attempts
      setFailedAttempts((prev) => prev + 1);

      // Lock account after 3 failed attempts
      if (failedAttempts >= 3 && !lockTime) {
        setLockTime(5);
        setCanLoginAgain(false); // Prevent login
      }

      setPopup({
        message: "Invalid username or password",
        type: "error",
        show: true,
      });
    }
  };

  useEffect(() => {
    if (lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(timer);
            setCanLoginAgain(true); // Allow login again
            return null;
          }
        });
      }, 60000); // Decrease lock time every minute

      return () => clearInterval(timer); // Cleanup interval on unmount
    }
  }, [lockTime]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {popup.show && <PopupMsg type={popup.type} message={popup.message} />}
      <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full lg:max-w-4xl">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col items-start justify-center bg-purple-700 text-white p-8 lg:w-1/2">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-32 mb-4" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Stay signed in for more</h1>
          <p className="text-sm mb-6">When you sign in, you are with us!</p>
          {[...Array(1)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 mb-4">
              <span className="text-green-500">
                <BsCheckCircleFill />
              </span>
              <p>
                <span className="font-semibold">Feature Title {i + 1}</span>
                <br />
                StyleVerse is a trendy online fashion store offering stylish
                apparel, accessories, and footwear for every occasion. Stay
                fashionable with the latest trends and premium-quality products!
                ✨🛍️
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between mt-4 w-full text-sm">
            <Link to="/" className="hover:underline">
              © StyleVerse
            </Link>
            <Link to="#" className="hover:underline">
              Terms
            </Link>
            <Link to="#" className="hover:underline">
              Privacy
            </Link>
            <Link to="#" className="hover:underline">
              Security
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
          {successMsg ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">{successMsg}</p>
              <Link to="/signup">
                <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sign In to Your Account
              </h2>
              <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2"
                    />{" "}
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className={`w-full py-2 rounded ${
                    canLoginAgain
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                  disabled={!canLoginAgain}
                >
                  {canLoginAgain ? "Sign In" : "Account Locked"}
                </button>
                <p className="text-sm text-center mt-4">
                  Not registered?{" "}
                  <Link
                    to="/signup"
                    className="text-purple-600 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </form>
              {lockTime && hasAttemptedLogin && (
                <p className="text-red-500 text-center mt-4">
                  Account locked. Try again in {lockTime} minutes.
                </p>
              )}
              {!isUserExist && (
                <p className="text-sm text-center mt-4">
                  User does not exist.{" "}
                  <Link
                    to="/signup"
                    className="text-purple-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
