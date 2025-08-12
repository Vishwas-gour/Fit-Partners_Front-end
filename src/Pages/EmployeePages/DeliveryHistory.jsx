import React, { useEffect, useState } from 'react';
import API from "../../API/API";
import "./css/history.css";

export default function DeliveryHistory({email}) {
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = () => {
    const url = email ? `/order/history/assignedTo?email=${email}`: `/order/history/assignedTo`;

    API.get(url)
      .then((res) => {
        const delivered = res.data.filter(order => order.orderStatus === "DELIVERED" || order.orderStatus === "RETURNED"   );
        setDeliveredOrders(delivered);
      })
      .catch((err) => {
        console.error("Error fetching orders", err);
      });
  };
 
  return (
    <div className="assigned-orders">
      <h2>Delivery History</h2>

      {deliveredOrders.length === 0 ? (
        <p>No delivered orders yet.</p>
      ) : (
        deliveredOrders.map((order) => (
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

            <p className="delivered-msg">✅ Delivered Successfully</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}
