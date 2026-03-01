import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("otpUserId");

      const res = await API.post("/auth/verify-otp", {
        userId,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.removeItem("otpUserId");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-3 rounded"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;
