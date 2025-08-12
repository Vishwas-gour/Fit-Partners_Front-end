import React, { useEffect, useState } from 'react';
import API from "../../API/API";
import "./css/assignedOrders.css"

export default function AssignedOrders({ email }) {
  const [assignedOrders, setAssignedOrders] = useState([]);
  console.log("AssignedOrders->",email)
  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = () => {

    const url = email ? `/order/current/assignedTo?email=${email}`: `/order/current/assignedTo`;
    API.get(url)
      .then((res) => {
        setAssignedOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching orders", err);
      });
  };

  const updateStatus = (orderId, newStatus) => {
    API.put(`/order/updateStatus/${orderId}/${newStatus}`)
      .then(() => {
        alert("Status updated!");
        fetchAssignedOrders(); // refresh
      })
      .catch((err) => {
        alert("Failed to update status");
        console.error(err);
      });
  };

  return (
    <div className="assigned-orders">
      <h2>Assigned Orders</h2>

      {assignedOrders.length === 0 ? (
        <p>No assigned orders yet.</p>
      ) : (
        assignedOrders.map((order) => (
          <div key={order.id} className="order-card">
            <h4>Order ID: {order.id}</h4>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
            <p><strong>Payment:</strong> {order.paymentMethod} (ID: {order.paymentId})</p>
            <p><strong>Placed By:</strong> {order.userEmail}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="item-card">
                  <img src={item.imageUrl} alt={item.shoeName} height="80" />
                  <p>{item.shoeName}</p>
                  <p><small>Brand: {item.brand}</small></p>
                </div>
              ))}
            </div>

            {/* === STATUS UPDATE === */}
            {(email == null &&  order.orderStatus === "PLACED" || order.orderStatus === "ON_THE_WAY" || order.orderStatus === "RETURNING") && (
              <div className="update-status">
                <select
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  defaultValue={order.orderStatus}
                >
                  <option value={order.orderStatus} disabled>
                    {order.orderStatus}
                  </option>
                  {order.orderStatus === "PLACED" && (
                    <option value="ON_THE_WAY">ON_THE_WAY</option>
                  )}
                  {order.orderStatus === "ON_THE_WAY" && (
                    <option value="DELIVERED">DELIVERED</option>
                  )}
                  {order.orderStatus === "RETURNING" && (
                    <option value="RETURNED" >RETURNED </option>
                  )}
                </select>
              </div>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}
