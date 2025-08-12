import React, { useEffect, useState } from 'react';
import API from '../../API/API';
import './css/users.css';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState([]);
  const navegate = useNavigate();

  useEffect(() => {
    API.get("/admin/findByRole?role=ROLE_USER")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users", err));
  }, []);
  console.log("users -> " + users)
  return (
    <div className="users-container">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="user-grid">
          {users.map(user => (
            <div key={user.id} className="user-card" onClick={()=>navegate(`${user.email}`)}>
              <h3>{user.email}</h3>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>State:</strong> {user.state}</p>
              <p><strong>Pincode:</strong> {user.pincode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
