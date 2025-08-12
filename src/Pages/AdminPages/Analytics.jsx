import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";


import {  Chart as ChartJS,  CategoryScale,  LinearScale,  TimeScale,  BarElement,  ArcElement,  LineElement,  PointElement,  Tooltip,  Legend,} from "chart.js";
import API from "../../API/API.jsx";
import "./css/analytics.css"

ChartJS.register(  CategoryScale,  LinearScale,  TimeScale,  BarElement,  ArcElement,  LineElement,  PointElement,  Tooltip,  Legend);

function Profit() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, DAILY, MONTHLY, YEARLY, CUSTOM
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  

  useEffect(() => {
    API.get("/order/allOrders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  const deliveredOrders = orders.filter(order => order.orderStatus === "DELIVERED");

  // ✅ Calculate profits
  const getProfit = (startDate, endDate) => {
    return deliveredOrders
      .filter(order => {
        const date = new Date(order.createdAt);
        return (!startDate || date >= startDate) && (!endDate || date <= endDate);
      })
      .reduce((sum, order) => sum + order.totalAmount * 0.2, 0);
  };

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  const todayProfit = getProfit(todayStart, today);
  const thisMonthProfit = getProfit(monthStart, today);
  const thisYearProfit = getProfit(yearStart, today);
  const totalProfit = getProfit();

  // ✅ Apply filter
  let filteredOrders = deliveredOrders;
  if (filter === "DAILY") {
    filteredOrders = deliveredOrders.filter(order => new Date(order.createdAt) >= todayStart);
  } else if (filter === "MONTHLY") {
    filteredOrders = deliveredOrders.filter(order => new Date(order.createdAt) >= monthStart);
  } else if (filter === "YEARLY") {
    filteredOrders = deliveredOrders.filter(order => new Date(order.createdAt) >= yearStart);
  } else if (filter === "CUSTOM" && customRange.start && customRange.end) {
    const start = new Date(customRange.start);
    const end = new Date(customRange.end);
    filteredOrders = deliveredOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= start && date <= end;
    });
  }

  // ✅ Prepare chart data
  const profits = filteredOrders.map(order => order.totalAmount * 0.2);
  const labels = filteredOrders.map(order => new Date(order.createdAt).toLocaleDateString());

  const barData = {
    labels,
    datasets: [
      {
        label: "Profit",
        data: profits,
        backgroundColor: "#4f46e5",
      },
    ],
  };

  // ✅ Brand-wise profit
  const brandProfits = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!brandProfits[item.brand]) brandProfits[item.brand] = 0;
      brandProfits[item.brand] += (item.salePriceWithDiscount || item.salePrice || 0) * 0.2;
    });
  });

  const pieData = {
    labels: Object.keys(brandProfits),
    datasets: [
      {
        data: Object.values(brandProfits),
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"],
      },
    ],
  };

  // ✅ Order status count
  const statusCount = orders.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: ["#4ade80", "#facc15", "#f87171", "#3b82f6"],
      },
    ],
  };

  // ✅ Total orders, revenue, average order value
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // ✅ Top brands (by items sold count)
  const brandFrequency = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      brandFrequency[item.brand] = (brandFrequency[item.brand] || 0) + 1;
    });
  });

  const topBrandLabels = Object.keys(brandFrequency);
  const topBrandCounts = Object.values(brandFrequency);

  const topBrandsData = {
    labels: topBrandLabels,
    datasets: [{
      label: "Items Sold",
      data: topBrandCounts,
      backgroundColor: "#3b82f6",
    }],
  };

  // ✅ Orders per day chart
  const ordersPerDay = {};
  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString();
    ordersPerDay[date] = (ordersPerDay[date] || 0) + 1;
  });

  const orderDates = Object.keys(ordersPerDay);
  const orderCounts = Object.values(ordersPerDay);

  const ordersPerDayData = {
    labels: orderDates,
    datasets: [{
      label: "Orders",
      data: orderCounts,
      fill: false,
      borderColor: "#10b981",
      tension: 0.3
    }]
  };

  return (
    <div className="profit-container">
      <h1 className="profit-heading">Profit Dashboard</h1>

      {/* 💰 Summary Cards */}
      <div className="profit-cards-row">
        <div className="profit-card"><h3>Today Profit</h3><p>₹{todayProfit.toFixed(2)}</p></div>
        <div className="profit-card"><h3>This Month</h3><p>₹{thisMonthProfit.toFixed(2)}</p></div>
        <div className="profit-card"><h3>This Year</h3><p>₹{thisYearProfit.toFixed(2)}</p></div>
        <div className="profit-card"><h3>Total Profit</h3><p>₹{totalProfit.toFixed(2)}</p></div>
      </div>

      {/* 📊 New Analytics Summary */}
      <div className="analytics-summary">
        <div className="profit-card"><h3>Total Orders</h3><p>{totalOrders}</p></div>
        <div className="profit-card"><h3>Total Revenue</h3><p>₹{totalRevenue.toFixed(2)}</p></div>
        <div className="profit-card"><h3>Avg Order Value</h3><p>₹{averageOrderValue.toFixed(2)}</p></div>
      </div>
      <div className="analytics-summary">
  <div className="profit-card"><h3>Delivered</h3><p>{statusCount["DELIVERED"] || 0}</p></div>
  <div className="profit-card"><h3>Placed</h3><p>{statusCount["PLACED"] || 0}</p></div>
  <div className="profit-card"><h3>Cancelled</h3><p>{statusCount["CANCELLED"] || 0}</p></div>
  <div className="profit-card"><h3>On the Way</h3><p>{statusCount["ON_THE_WAY"] || 0}</p></div>
  <div className="profit-card"><h3>RETURNING</h3><p>{statusCount["RETURNING"] || 0}</p></div>
  <div className="profit-card"><h3>RETURNED</h3><p>{statusCount["RETURNED"] || 0}</p></div>
</div>


      {/* 🔍 Filter Options */}
      <div className="filter-section">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="DAILY">Today</option>
          <option value="MONTHLY">This Month</option>
          <option value="YEARLY">This Year</option>
          <option value="CUSTOM">Custom</option>
        </select>
        {filter === "CUSTOM" && (
          <div className="date-picker">
            <input type="date" onChange={e => setCustomRange({ ...customRange, start: e.target.value })} />
            <input type="date" onChange={e => setCustomRange({ ...customRange, end: e.target.value })} />
          </div>
        )}
      </div>

      {/* 📈 Charts Section */}
      <div className="profit-charts">
        <div className="chart-box"><h3>Profit Trend</h3><Bar data={barData} /></div>
        <div className="chart-box"><h3>Brand Profit</h3><Pie data={pieData} /></div>
        <div className="chart-box"><h3>Order Status</h3><Doughnut data={doughnutData} /></div>
        <div className="chart-box"><h3>Top Brands by Sales</h3><Bar data={topBrandsData} /></div>
        <div className="chart-box"><h3>Orders Per Day</h3><Line data={ordersPerDayData} /></div>
      </div>
    </div>
  );
}

export default Profit;
