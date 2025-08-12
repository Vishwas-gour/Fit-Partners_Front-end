import React, { useState } from 'react'
import AssignedOrders from '../EmployeePages/AssignedOrders';
import DeliveryHistory from '../EmployeePages/DeliveryHistory';
import { useParams } from 'react-router-dom';
import './css/employeeDetails.css'; // Import the CSS file

function EmployeeDetails() {
  const [view, setView] = useState();
  const {email} = useParams();
  console.log(email)

  return (
    <>
      {/* Theme Toggle Button */}
  

      {/* Header Section */}
      <div className="header">

        <p className="employee-email">Employee: {email}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button 
          className={`nav-btn ${view === "AssignedOrders" ? 'active' : ''}`}
          onClick={() => setView("AssignedOrders")}
        >
          <span className="btn-icon">📋</span>
          Assigned Orders
        </button>
        <button 
          className={`nav-btn ${view === "EmployeeHistory" ? 'active' : ''}`}
          onClick={() => setView("EmployeeHistory")}
        >
          <span className="btn-icon">📚</span>
          History
        </button>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {!view && (
          <div className="welcome-message">
            <h2>Welcome to Employee Dashboard</h2>
            <p>Please select an option above to view your assigned orders or delivery history.</p>
          </div>
        )}
        {view === "AssignedOrders" && <AssignedOrders email={email} />}
        {view === "EmployeeHistory" && <DeliveryHistory email={email}/>}
      </div>
    </>
  );
}

export default EmployeeDetails;