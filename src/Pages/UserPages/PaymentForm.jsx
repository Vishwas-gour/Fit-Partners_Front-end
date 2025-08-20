import { useState, useEffect } from "react";
import API from "../../API/API.jsx";
import PromoPriceBox from "./PromoPriceBox.jsx";
import "./css/payment.css";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";

function PaymentForm() {
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [address, setAddress] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const fetchData = () => {
    setLoading(true);
    const minTime = new Promise((resolve) => setTimeout(resolve, 100));
    const cartApi = API.get("/cart");
    const userApi = API.get("/user/profile");

    Promise.all([minTime, cartApi, userApi])
      .then(([, cartRes, userRes]) => {
        setCartItems(cartRes.data);
        setUserInfo(userRes.data);
        setAddress({
          phone: userRes.data.phone,
          city: userRes.data.city,
          state: userRes.data.state,
          pincode: userRes.data.pincode,
          street: userRes.data.street
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  console.log(userInfo)
  if (loading) {
    return (
      <EmptyPage
        text="Payment page Loading..."
        height="80vh"
        width="100%"
        fontSize="40px"
        center
      />
    );
  }

  return (
    <div className="container">
      <div className="payment-container">
        <div className="payment-left">
          {/* Address Form */}
          <div className="payment-address-box">
            <h3>📦 Delivery Address</h3>
            <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} />
            <input name="street" placeholder="Street Address" value={address.street} onChange={handleChange} />
            <input name="city" placeholder="City" value={address.city} onChange={handleChange} />
            <input name="state" placeholder="State" value={address.state} onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} />
          </div>

          {/* Delivery Address Preview */}
          <div className="payment-address-preview">
            <h4>📍 Delivery To:</h4>
            {address.street || address.city || address.state || address.pincode ? (
              <p className="address-text">
                {userInfo.username} <br />
                {address.phone} <br />
                {address.street}, {address.city}, {address.state} - {address.pincode}
              </p>
            ) : (
              <p className="address-placeholder">Enter your delivery address above.</p>
            )}
          </div>

          {/* Cart Items */}
          <div className="mycart-product-list">
            <h4 className="order-review-title">
              📋 Review your items before placing the order
            </h4>
            {cartItems.map((item) => {
              const finalPrice = item.salePriceWithDiscount * item.quantity;

              return (
                <div className="mycart-card" key={item.id}>
                  <div className="mycart-image-box">
                    <img src={item.imageUrl} alt={item.shoeName} />
                  </div>

                  <div className="mycart-details-box">
                    <h3>
                      {item.shoeName.length > 30
                        ? item.shoeName.substring(0, 30) + "..."
                        : item.shoeName}
                    </h3>
                    <span>
                      <b>Category:</b> {item.category}
                    </span>

                    <div className="mycart-size-list">
                      <span className="mycart-size-box">size : {item.selectedSize}</span>
                    </div>

                    {item.color && (
                      <div className="mycart-color-list">
                        <b>Color:</b>
                        {(Array.isArray(item.color) ? item.color : [item.color]).map(
                          (clr, idx) => (
                            <span
                              className="mycart-color-box"
                              key={idx}
                              style={{ backgroundColor: clr.toLowerCase() }}
                              title={clr}
                            ></span>
                          )
                        )}
                      </div>
                    )}

                    <div className="mycart-price-info">
                      <span className="price-strong">₹{item.salePriceWithDiscount}</span>
                      <span>
                        <s>₹{item.salePrice}</s>
                      </span>
                      <span className="payment-discount discount">({item.discountPercent}% OFF)</span>
                      <span>Total: ₹{finalPrice}</span>
                    </div>

                    <div className="mycart-quantity">
                      <span>{item.quantity} item</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE - Promo Box */}
        <div className="payment-right">
          <PromoPriceBox cartItems={cartItems} from="paymentForm" />
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
