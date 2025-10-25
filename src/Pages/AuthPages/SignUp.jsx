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
    role: "ROLE_USER",
    phone: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    otp: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // prevent numbers in text-only fields
    const textOnlyFields = ["username", "city", "state", "country", "street"];
    if (textOnlyFields.includes(name)) {
      value = value.replace(/[0-9]/g, ""); // remove numbers
    }

    // only numbers for phone and pincode
    if (name === "phone" || name === "pincode") {
      value = value.replace(/[^0-9]/g, "");
    }

    setFormData({ ...formData, [name]: value });
  };

  // validation helpers
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) => password.length >= 6;

  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const isValidPincode = (pincode) => /^[0-9]{6}$/.test(pincode);

  const sendOtp = async () => {
    if (!formData.email) return alert("Enter your email first");
    if (!isValidEmail(formData.email))
      return alert("Enter a valid email");

    try {
      setSendingOtp(true);
      await API.post("/auth/send-otp", {
        email: formData.email,
        subject: "register",
      });
      alert("OTP sent successfully!");
      setStep(3);
    } catch (err) {
      alert(err.response?.data || "Something went wrong.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleNext = async () => {
    // Step 1 validation
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.password) {
        return alert("Fill all fields in Step 1");
      }
      if (!isValidEmail(formData.email))
        return alert("Invalid email format");
      if (!isValidPassword(formData.password))
        return alert("Password must be at least 6 characters");
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
      if (!isValidPhone(formData.phone))
        return alert("Phone must be 10 digits");
      if (!isValidPincode(formData.pincode))
        return alert("Pincode must be 6 digits");

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
        otp: formData.otp,
      });

      // Register
      await API.post("/auth/register", formData);

      alert("Registered successfully!");
      navTo("/login");
    } catch (err) {
      alert(err.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>SignUp – Step {step} of 3</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
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
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <input
              name="phone"
              type="text"
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={10}
            />
            <input
              name="houseNumber"
              type="text"
              placeholder="House Number"
              value={formData.houseNumber}
              onChange={handleChange}
              required
            />
            <input
              name="street"
              type="text"
              placeholder="Street"
              value={formData.street}
              onChange={handleChange}
            />
            <input
              name="city"
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              name="state"
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              name="country"
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
            />
            <input
              name="pincode"
              type="text"
              placeholder="Pincode (6 digits)"
              value={formData.pincode}
              onChange={handleChange}
              maxLength={6}
            />
          </>
        )}

        {step === 3 && (
          <>
            <input
              name="otp"
              type="text"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
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
            <button type="button" onClick={registerUser} disabled={loading}>
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
