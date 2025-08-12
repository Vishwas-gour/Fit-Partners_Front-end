import React, { useEffect, useState } from 'react';
import API from '../../API/API';
import './css/employees.css';
import { useNavigate } from 'react-router-dom';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const navegate = useNavigate();
  useEffect(() => {
    API.get('/admin/findByRole?role=ROLE_EMPLOYEE')
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Failed to load employees", err));
  }, []);
  console.log("employees -> " + employees)
  return (
    <div className="employees-container">
      <h2>All Employees</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="employee-grid">
          {employees.map(emp => (
            <div className="employee-card" key={emp.id}  onClick={()=>navegate(`${emp.email}`)}>
              <h3>{emp.username}</h3>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Phone:</strong> {emp.phone}</p>
              <p><strong>City:</strong> {emp.city}</p>
              <p><strong>State:</strong> {emp.state}</p>
              <p><strong>Pincode:</strong> {emp.pincode}</p>
              <p><strong>Address:</strong> {emp.houseNumber}, {emp.street}</p>
              <button onClick={()=>navegate(`${emp.email}`)}> </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Employees;
