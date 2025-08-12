import React, { useEffect } from "react";
import "./css/welcomePage.css";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")
  useEffect(()=>{
    if(role === "ROLE_ADMIN"){
      navigate("/admin")
    }
    if(role === "ROLE_EMPLOYEE"){
      
      navigate("/employee")
    }
    else{
      navigate("/")
  }
  })

  return (
    <div className="welcome-container">


      <section className="welcome-hero">
        <h2>Welcome to Fit_Partners.com</h2>
        <p>Your perfect fit starts here. Explore stylish & comfortable shoes.</p>
        <button className="explore-btn" onClick={() => navigate("/shop")}>
          Explore Collection
        </button>
      </section>

    </div>
  );
}
