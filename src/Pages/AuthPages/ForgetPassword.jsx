import React, { useState } from "react";
import API from "../../API/API.jsx";
import { Link, useNavigate } from "react-router-dom";
import "./css/auth.css";

const ForgetPassword = () => {
  const navTo = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) return alert("Please enter your email!");

    try {
      setSendingOtp(true);
      await API.post("/auth/send-otp", {
        email: formData.email,
        subject: "forgot",
      });
      alert("OTP sent to your email!");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setResetting(true);

      // First verify OTP
      await API.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      // Then reset password
      await API.post("/auth/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });

      alert("Password changed!");
      navTo("/login");
    } catch (err) {
      alert(err.response?.data || "Failed to reset password!");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Forgot Password</h2>
      <form>
        <input  name="email"  type="email"  placeholder="Email"  value={formData.email}  onChange={handleChange}  required/>

        {!otpSent && (
          <button type="button" onClick={sendOtp} disabled={sendingOtp}>{sendingOtp ? "Sending OTP..." : "Send OTP"}</button>
        )}

        {otpSent && (
          <>
            <input name="otp" type="text" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
            <input name="newPassword" type="password" placeholder="New Password" value={formData.newPassword} onChange={handleChange} />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            <button type="button" onClick={resetPassword} disabled={resetting}>
              {resetting ? "Resetting..." : "Verify & Reset"}
            </button>
          </>
        )}

        <Link to="/login">Login</Link>
      </form>
    </div>
  );
};

export default ForgetPassword;
