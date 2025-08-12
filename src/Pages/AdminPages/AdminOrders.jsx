import React, { useEffect, useState } from "react";
import API from "../../API/API";
import "./css/adminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderStatus: "",
    orderTime: ""
  });

  const [counts, setCounts] = useState({
    CANCELLED: 0,
    DELIVERED: 0,
    ON_THE_WAY: 0,
    RETURNED: 0
  });
  console.log(orders)

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = () => {
    API.get("/order/allOrders")
      .then((res) => {
        setOrders(res.data);
        countStatuses(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchFilteredOrders = () => {
    API.get("/order/filter", { params: filters })
      .then((res) => {
        setOrders(res.data);
        countStatuses(res.data);
      })
      .catch((err) => console.log(err));
  };

  const countStatuses = (orders) => {
    const countsObj = {
      CANCELLED: 0,
      DELIVERED: 0,
      ON_THE_WAY: 0,
      RETURNED: 0
    };

    orders.forEach((order) => {
      const status = order.orderStatus;
      if (status in countsObj) {
        countsObj[status]++;
      }
    });

    setCounts(countsObj);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({ orderStatus: "", orderTime: "" });
    fetchAllOrders();
  };

  return (
    <div className="admin-orders-container">
      <h2>All Orders (Admin View)</h2>

      {/* Status Counts */}
      <div className="order-status-summary">
        <div className="status-box delivered">Delivered: {counts.DELIVERED}</div>
        <div className="status-box on-way">On The Way: {counts.ON_THE_WAY}</div>
        <div className="status-box cancelled">Cancelled: {counts.CANCELLED}</div>
        <div className="status-box returned">Returned: {counts.RETURNED}</div>
      </div>

      {/* Filters */}
      <div className="admin-orders-filters">
        <select name="orderStatus" value={filters.orderStatus} onChange={handleFilterChange}>
          <option value="">-- Order Status --</option>
          <option value="ON_THE_WAY">On The Way</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RETURNED">Returned</option>
        </select>

        <select name="orderTime" value={filters.orderTime} onChange={handleFilterChange}>
          <option value="">-- Order Time --</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="OLDER">Older</option>
        </select>

        <button onClick={fetchFilteredOrders}>Search</button>
        <button onClick={resetFilters}>Reset</button>
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Order #{order.id}</h3>
              <p><strong>User:</strong> {order.userEmail || "N/A"}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div className="order-item" key={i}>
                    <img src={item.imageUrl} alt={item.shoeName} />
                    <p>{item.shoeName}</p>
                    <p>Qty: {item.quantity}</p>
                    <p> ₹{item.salePrice}</p>
                    <p> {item.discountPercent}%</p>
                    <p><strong>₹{item.salePriceWithDiscount}</strong></p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
