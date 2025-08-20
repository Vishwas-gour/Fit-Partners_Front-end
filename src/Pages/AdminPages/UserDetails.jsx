import { useEffect, useState } from "react";
import {
  FaTruck, FaCheckCircle, FaTimesCircle, FaUndo, FaClock
} from "react-icons/fa";
import API from "../../API/API";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";
import { useParams } from "react-router-dom";
import "./css/userDetails.css";

function UserDetail() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const { email } = useParams();

  const fetchUser = () => {
    API.get(`/user/profile/${email}`)
      .then(res => setUser(res.data));
  };

  const fetchOrders = () => {
    API.get(`/order/orders/${email}`)
      .then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, []);

  const renderIcon = (status) => {
    switch (status) {
      case "PLACED":
        return <FaClock color="orange" />;
      case "ON_THE_WAY":
        return <FaTruck color="blue" />;
      case "DELIVERED":
        return <FaCheckCircle color="green" />;
      case "CANCELLED":
        return <FaTimesCircle color="red" />;
      case "RETURNED":
        return <FaUndo color="purple" />;
      default:
        return null;
    }
  };

  const countAllItems = () => {
    let total = 0;
    orders.forEach(order => total += order.items.length);
    return total;
  };

  const statusCount = (status) => {
    return orders.filter(order => order.orderStatus === status).length;
  };

  const handleBlockToggle = () => {
    API.put(`/user/toggle-block/${email}`) // You must have this endpoint
      .then(() => fetchUser());
  };

  return (
    <div className="user-detail-container">
      <h2>User Dashboard</h2>

      <div className="stats">
        <p><strong>Total  Orders:</strong> {orders.length}</p>
        <p><strong>Total Products Ordered:</strong> {countAllItems()}</p>
        <p><strong>PLACED:</strong> {statusCount("PLACED")}</p>
        <p><strong>ON_THE_WAY:</strong> {statusCount("ON_THE_WAY")}</p>
        <p><strong>DELIVERED:</strong> {statusCount("DELIVERED")}</p>
        <p><strong>CANCELLED:</strong> {statusCount("CANCELLED")}</p>
        <p><strong>RETURNED:</strong> {statusCount("RETURNED")}</p>
        <button className={user.isBlocked ? "unblock-btn" : "block-btn"}
          onClick={handleBlockToggle}
        >
          {user.isBlocked ? "Unblock User" : "Block User"}
        </button>
      </div>

      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.houseNumber}, {user.street}, {user.city}, {user.state} - {user.pincode}</p>
        <p><strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}</p>
      </div>

      <h2>Orders</h2>
      {orders.length === 0 ? (
        <EmptyPage />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {renderIcon(order.orderStatus)} {order.orderStatus}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentId})</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <div className="items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item">
                    <img src={item.imageUrl} alt={item.shoeName} />
                    <p>{item.shoeName}</p>
                    <p><strong>Brand:</strong> {item.brand}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDetail;
