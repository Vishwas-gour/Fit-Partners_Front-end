import React, { useState } from "react";
import API from "../../API/API.jsx";
import { Link, useNavigate } from "react-router-dom";
import "./css/auth.css";

const SignUp = () => {
  const navTo = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    otp: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) return alert("Enter your email first");
    try {
      setSendingOtp(true);
      await API.post("/auth/send-otp", {
        email: formData.email,
        subject: "register"
      });
      alert("OTP sent successfully!");
      setSendingOtp(false);
      setStep(3);
    } catch (err) {
      setSendingOtp(false);
      alert(err.response?.data || "Something went wrong.");
    }
  };

  const handleNext = async () => {
    // Step 1 validation
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.password) {
        return alert("Fill all fields in Step 1");
      }
      return setStep(2);
    }

    // Step 2 validation + send OTP
    if (step === 2) {
      if (
        !formData.phone ||
        !formData.houseNumber ||
        !formData.city ||
        !formData.state ||
        !formData.country ||
        !formData.pincode
      ) {
        return alert("Fill all address fields");
      }
      await sendOtp();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const registerUser = async () => {
    if (!formData.otp) return alert("Enter OTP");

    try {
      setLoading(true);

      // Verify OTP
      await API.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });

      // Register
      await API.post("/auth/register", formData);

      setLoading(false);
      alert("Registered successfully!");
      navTo("/login");
    } catch (err) {
      setLoading(false);
      alert(err.response?.data || "Something went wrong.");
    }
  };

  return (
    <div className="register-container">
      <h2>SignUp – Step {step} of 3</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <input  name="username"  type="text"  placeholder="Username"  value={formData.username}  onChange={handleChange}  required/>
            <input  name="email"  type="email"  placeholder="Email"  value={formData.email}  onChange={handleChange}  required/>
            <input  name="password"  type="password"  placeholder="Password"  value={formData.password}  onChange={handleChange}  required
            />
          </>
        )}

        {step === 2 && (
          <>
            <input  name="phone"  type="text"  placeholder="Phone Number"  value={formData.phone}  onChange={handleChange}  required/>
            <input  name="houseNumber"  type="text"  placeholder="House Number"  value={formData.houseNumber}  onChange={handleChange}/>
            <input  name="street"  type="text"  placeholder="Street"  value={formData.street}  onChange={handleChange}/>
            <input  name="city"  type="text"  placeholder="City"  value={formData.city}  onChange={handleChange}/>
            <input  name="state"  type="text"  placeholder="State"  value={formData.state}  onChange={handleChange}/>
            <input  name="country"  type="text"  placeholder="Country"  value={formData.country}  onChange={handleChange}/>
            <input  name="pincode"  type="text"  placeholder="Pincode"  value={formData.pincode}  onChange={handleChange}/>
          </>
        )}

        {step === 3 && (
          <>
            <input name="otp" type="text" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} required
            />
          </>
        )}

        <div className="step-buttons">
          {step > 1 && (
            <button type="button" onClick={handlePrev}>
              Previous
            </button>
          )}

          {step === 1 && (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          )}

          {step === 2 && (
            <button type="button" onClick={handleNext} disabled={sendingOtp}>
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={registerUser}
              disabled={loading}
            >
              {loading ? "Registering..." : "Verify & Register"}
            </button>
          )}
        </div>

        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
};

export default SignUp;
