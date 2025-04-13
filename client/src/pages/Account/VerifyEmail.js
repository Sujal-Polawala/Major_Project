import { useState, useEffect } from "react";
import axios from "axios";
import { PopupMsg } from "../../components/popup/PopupMsg";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromURL = queryParams.get("email");

  const [email, setEmail] = useState(emailFromURL || localStorage.getItem("verificationEmail"));
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "", show: false });
  const [timer, setTimer] = useState(60);  // 1-minute timer
  const [canResend, setCanResend] = useState(false);  // Controls if resend button is enabled
  const navigate = useNavigate();

  // Timer countdown effect
  useEffect(() => {
    let countdown;

    if (timer > 0 && !canResend) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer, canResend]);

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/, ""); // Allow only digits
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input field
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const code = otp.join("");

    if (!email) {
      setPopup({ message: "Email is missing!", type: "error", show: true });
      setLoading(false);
      return;
    }

    if (code.length !== 6) {
      setPopup({ message: "Please enter a valid 6-digit OTP.", type: "error", show: true });
      setLoading(false);
      return;
    }

    console.log("Sending:", { email, code });

    try {
      const res = await axios.post("http://localhost:5000/api/verify-email", { email, code });
      console.log("Response:", res.data);

      setPopup({ message: "Email Verified Successfully!", type: "success", show: true });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response?.data);
      setPopup({ message: error.response?.data?.message || "Error occurred", type: "error", show: true });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/resend-code", { email });
      setPopup({ message: "A new verification code has been sent to your email.", type: "success", show: true });
      setTimer(60);  // Reset timer to 60 seconds
      setCanResend(false); // Disable resend button
    } catch (error) {
      console.error("Error:", error.response?.data);
      setPopup({ message: error.response?.data?.message || "Error occurred", type: "error", show: true });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
        <h2 className="text-2xl font-semibold text-center text-gray-700">Verify Your Email</h2>
        <p className="text-center text-gray-500 mb-4">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white font-semibold rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            className="mt-4 w-full py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600"
            onClick={handleResend}
            disabled={!canResend || loading}
          >
            {canResend ? "Resend Code" : `Resend Code in ${timer}s`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
