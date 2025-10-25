import React, { useState } from "react";
import API from "../../API/API.jsx";
import { Link } from "react-router-dom";
import "./css/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [sendingOtp, setSendingOtp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // track if OTP is sent

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const otpSend = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return alert("Enter your email first!");
    if (!isValidEmail(formData.email)) return alert("Enter a valid email address!");

    try {
      setSendingOtp(true);
      await API.post("/auth/send-otp", {
        email: formData.email,
        subject: "login",
      });
      setOtpSent(true); // show OTP field after sending
      alert("OTP sent!");
    } catch (err) {
      alert(err.response?.data || "Something went wrong. Try again later.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.password.trim()) return alert("Password is required!");
    if (formData.password.length < 6)
      return alert("Password must be at least 6 characters long!");
    if (!formData.otp.trim()) return alert("Enter OTP to login");

    try {
      setLoggingIn(true);

      // First verify OTP
      await API.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      // Then login
      const res = await API.post("/auth/login", formData);
      alert("Login successful!");

      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      if (data.role === "ROLE_ADMIN") {
        window.location.href = "/admin";
      } else if (data.role === "ROLE_EMPLOYEE") {
        window.location.href = "/employee";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      alert(err.response?.data || "Login failed!");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="register-container">
        <h2>Login</h2>
        <form>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="links">
            <Link to="/forgetPassword">Forget Password</Link>&nbsp; | &nbsp;
            <Link to="/signUp"> SignUp</Link>
          </div>

          {!otpSent && (
            <button type="button" onClick={otpSend} disabled={sendingOtp}>
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {otpSent && (
            <>
              <input
                name="otp"
                type="text"
                placeholder="OTP"
                value={formData.otp}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleLogin}
                disabled={loggingIn}
              >
                {loggingIn ? "Logging in..." : "Verify & Login"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
