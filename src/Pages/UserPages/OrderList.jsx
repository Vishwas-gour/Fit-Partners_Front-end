import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import API from "../../API/API";
import generateOrderPDF from "../../Functions/generateOrderPDF";
import { useDispatch } from "react-redux";
import { setCartCount, setWishlistCount, setOrderCount } from "../../Redux/GlobalSlice.jsx";
import ReviewSection from "../../Components/ReviewSection.jsx";
import "./css/orderList.css";
import { FaTruck, FaCheckCircle, FaTimesCircle, FaUndo, FaClock } from "react-icons/fa";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [openReviewFor, setOpenReviewFor] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [filters, setFilters] = useState({ orderStatus: "", orderTime: "" });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    API.get("/cart/count").then(res => dispatch(setCartCount(res.data)));
    API.get("/wishlist/count").then(res => dispatch(setWishlistCount(res.data)));
    API.get("/order/count").then(res => dispatch(setOrderCount(res.data)));
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    const minTime = new Promise(resolve => setTimeout(resolve, 100));
    const ordersApi = API.get("/order/orders");

    Promise.all([minTime, ordersApi])
      .then(([, res]) => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const updateStatus = (orderId, newStatus) => {
    API.put(`/order/updateStatus/${orderId}/${newStatus}`)
      .then(() => fetchOrders())
      .catch(err =>{
         console.log(err)
         alert(err.response?.data || "Error cancelling order")
      });
  };



  const toggleReviewBox = (orderId, shoeId) => {
    const key = `${orderId}_${shoeId}`;
    setOpenReviewFor(prev => (prev === key ? null : key));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const searchOrders = () => {
    setLoading(true);
    const minTime = new Promise(resolve => setTimeout(resolve, 500));
    const searchApi = API.get("/order/filter", { params: filters });

    Promise.all([minTime, searchApi])
      .then(([, res]) => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const canReturn = (orderDateStr) => {
    const orderDate = new Date(orderDateStr);
    const today = new Date();
    const diffInMs = today - orderDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays < 7;
  };



  if (loading) {
    return <EmptyPage text="Loading Orders..." height="80vh" width="100%" fontSize="40px" center />;
  }

  return (
    <div className={`orderPage-container ${isFilterOpen ? "filters-open" : ""}`}>

      <div className={`orderPage-filters ${isFilterOpen ? "open" : ""}`}>
        <div className="orderPage-filter-group">
      <button className="react-icon-btn orderPage-filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
        {isFilterOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
          <label className="orderPage-filter-title">Order Status</label>
          {[
            { value: "ON_THE_WAY", label: "On The Way", icon: <FaTruck /> },
            { value: "DELIVERED", label: "Delivered", icon: <FaCheckCircle /> },
            { value: "CANCELLED", label: "Cancelled", icon: <FaTimesCircle /> },
            { value: "RETURNED", label: "Returned", icon: <FaUndo /> }
          ].map(({ value, label, icon }) => (
            <label key={value} className="orderPage-radio-label">
              <input
                type="radio"
                name="orderStatus"
                value={value}
                checked={filters.orderStatus === value}
                onChange={handleChange}
              />
              <span className="radio-icon">{icon}</span> {label}
            </label>
          ))}
        </div>

        <div className="orderPage-filter-group">
          <label className="orderPage-filter-title">Order Time</label>
          {["2025", "2024", "2023", "2022", "2021", "OLDER"].map(time => (
            <label key={time} className="orderPage-radio-label">
              <input
                type="radio"
                name="orderTime"
                value={time}
                checked={filters.orderTime === time}
                onChange={handleChange}
              />
              <span className="radio-icon"><FaClock /></span>
              {time === "OLDER" ? "Older" : time}
            </label>
          ))}
        </div>

        <button className="react-icon-btn search" onClick={searchOrders}>
          Search
        </button>
      </div>

      <div className="orderPage-orders-section">
        <h2 className="orderPage-orders-title">My Orders</h2>

        {orders.map(order => (
          <div key={order.id} className="orderList-order-card">
            <div className="orderList-order-header">
              <span className={`orderList-status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="orderList-order-details">
              <p><b>Total:</b> ₹{order.totalAmount}</p>
              <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
              <p><b>Updated Date:</b> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "Not updated yet"}</p>
            </div>

            <div className="orderList-item-list">
              {order.items.map(item => {
                const shoeId = String(item.shoeId);
                const uniqueKey = `${order.id}_${shoeId}`;

                return (
                  <div key={uniqueKey} className="orderList-item-card">
                    <img src={item.imageUrl} alt={item.shoeName} className="orderList-item-image" />

                    <div className="orderList-item-info">
                      <h4>{item.shoeName}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.salePriceWithDiscount}</p>

                      <button className="orderList-review-btn" onClick={() => toggleReviewBox(order.id, shoeId)}>
                        Review
                      </button>
                    </div>

                    {openReviewFor === uniqueKey && (
                      <div className="orderList-review-section-side">
                        <button className="orderList-review-btn" onClick={() => toggleReviewBox(order.id, shoeId)}> Close Review </button>
                        <ReviewSection shoeId={item.shoeId} from="orders" status={order.orderStatus} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="orderList-order-actions">
              {/* DELIVERED -> Show Return + Cancel */}
              {order.orderStatus === "DELIVERED" && (
                <>
                  <button className="orderList-invoice-btn" onClick={() => generateOrderPDF(order)}>Download Invoice</button>
                  {canReturn(order.updatedAt) && (
                    <button className="orderList-invoice-btn" onClick={() => updateStatus(order.id, "RETURNING")}>Return Order</button>
                  )}
                </>
              )}

              {/* RETURNING -> Allow to cancel returning and go back to DELIVERED */}
              {order.orderStatus === "RETURNING" && (
                <button className="orderList-cancel-btn" onClick={() => updateStatus(order.id, "DELIVERED")}>Cancel Returning</button>
              )}

              {/* PLACED or ON_THE_WAY -> Allow cancel */}
              {["PLACED", "ON_THE_WAY"].includes(order.orderStatus) && (
                <button className="orderList-cancel-btn" onClick={() => updateStatus(order.id, "CANCELLED")}>Cancel Order</button>
              )}

            </div>


          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
