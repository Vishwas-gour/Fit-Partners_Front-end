import { useEffect, useState } from "react";
import API from "../API/API"
import "./css/myProfile.css"
function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/user/profile")
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Profile fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <h2 className="profile-title">My Profile</h2>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      ) : profile ? (
        <div className="admin-profile-card">
          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-icon">ℹ️</span>
              Personal Information
            </h3>
            <div className="profile-info-grid">
              <div className="profile-field">
                <span className="field-label">Name:</span>
                <span className="field-value">{profile.username}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Email:</span>
                <span className="field-value">{profile.email}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Phone:</span>
                <span className="field-value">{profile.phone}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-icon">📍</span>
              Address
            </h3>
            <ul className="address-list">
              <li className="address-item">
                <span className="address-label">House No:</span>
                <span className="address-value">{profile.houseNumber}</span>
              </li>
              <li className="address-item">
                <span className="address-label">Street:</span>
                <span className="address-value">{profile.street}</span>
              </li>
              <li className="address-item">
                <span className="address-label">City:</span>
                <span className="address-value">{profile.city}</span>
              </li>
              <li className="address-item">
                <span className="address-label">State:</span>
                <span className="address-value">{profile.state}</span>
              </li>
              <li className="address-item">
                <span className="address-label">Pincode:</span>
                <span className="address-value">{profile.pincode}</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">Failed to load profile. Please try again.</p>
          <button className="btn-retry">Retry</button>
        </div>
      )}
    </div>
  );
}
export default MyProfile