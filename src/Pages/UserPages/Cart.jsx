import { useEffect, useState } from "react";
import API from "../../API/API.jsx";
import PromoPriceBox from "./PromoPriceBox.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCartCount,
  setWishlistCount,
  setOrderCount
} from "../../Redux/GlobalSlice.jsx";
import "./css/cart.css";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navTo = useNavigate();

  useEffect(() => {
    API.get("/cart/count").then(res => dispatch(setCartCount(res.data)));
    API.get("/wishlist/count").then(res => dispatch(setWishlistCount(res.data)));
    API.get("/order/count").then(res => dispatch(setOrderCount(res.data)));
  }, [dispatch]);

  const fetchCart = () => {
    setLoading(true);
    const minTime = new Promise(resolve => setTimeout(resolve, 500));
    const cartApi = API.get("/cart");

    Promise.all([minTime, cartApi])
      .then(([, res]) => setCartItems(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    API.put(`/cart/${id}/quantity`, null, { params: { quantity: newQty } })
      .then(() => fetchCart());
  };

  const removeItem = (id) => {
    API.delete(`/cart/${id}`).then(() => fetchCart());
  };

  const changeSize = (cartId, size) => {
    API.put(`/cart/${cartId}/size`, null, { params: { size } })
      .then(() => fetchCart());
  };

  const handlePayment = () => {
    navTo("/user/paymentForm");
  };

  if (loading) {
    return (
      <EmptyPage
        text="Loading Cart..."
        height="80vh"
        width="100%"
        fontSize="40px"
        center
      />
    );
  }

  return (
    <div className="cart-container">
      {/* Cart Items */}
      <div className="cart-product-list">
        {cartItems.map((item) => {
          const finalPrice = item.salePriceWithDiscount * item.quantity;

          return (
            <div className="cart-card" key={item.id}>
              {/* Image */}
              <div className="cart-image-box">
                <img src={item.imageUrl} alt={item.shoeName} />
              </div>

              {/* Details */}
              <div className="cart-details-box">
                <h3>
                  {item.shoeName.length > 30
                    ? item.shoeName.substring(0, 30) + "..."
                    : item.shoeName}
                </h3>

                <span><b>Category:</b> {item.category}</span>

                {/* Sizes */}
                {item.size && (
                  <div className="cart-size-list">
                    <b>Size:</b>
                    {item.size.map((sz, idx) => (
                      <span
                        key={idx}
                        className={`cart-size-box ${Number(sz) === Number(item.selectedSize) ? "cart-active-size" : ""}`}
                        onClick={() => changeSize(item.id, sz)}
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                )}

                {/* Colors */}
                {item.color && (
                  <div className="cart-color-list">
                    <b>Color:</b>
                    {item.color.map((clr, idx) => (
                      <span
                        key={idx}
                        className="cart-color-box"
                        style={{ backgroundColor: clr.toLowerCase() }}
                        title={clr}
                      ></span>
                    ))}
                  </div>
                )}

                {/* Price Info */}
                <div className="cart-price-info">
                  <span style={{ fontWeight: "700", fontSize: "17px" }}>
                    ₹{item.salePriceWithDiscount}
                  </span>
                  <span><s>₹{item.salePrice}</s></span>
                  <span className="cart-discount">
                    ({item.discountPercent}% OFF)
                  </span>
                  <span><b>Cart Price: ₹{finalPrice}</b></span>
                </div>

                {/* Actions */}
                <div className="cart-actions-inline">
                  <div className="cart-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>➖</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>➕</button>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Box */}
      <div className="cart-price-box">
        <PromoPriceBox cartItems={cartItems} from="cart" />
        <button
          className="cart-buy-btn"
          style={{ width: "100%", marginTop: "15px" }}
          onClick={handlePayment}
        >
          🛍️ Buy Now
        </button>
      </div>
    </div>
  );
}

export default Cart;
