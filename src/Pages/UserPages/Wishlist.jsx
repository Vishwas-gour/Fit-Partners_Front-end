import React, { useEffect, useState } from "react";
import API from "../../API/API.jsx";
import { useDispatch } from "react-redux";
import {
  setCartCount,
  setWishlistCount,
  setOrderCount
} from "../../Redux/GlobalSlice.jsx";
import "./css/wishlist.css";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const dispatch = useDispatch();

  const fetchWishlist = () => {
    setLoading(true);
    const minTime = new Promise((resolve) => setTimeout(resolve, 100)); // ✅ 500ms delay

    Promise.all([
      minTime,
      API.get("/cart/count"),
      API.get("/wishlist/count"),
      API.get("/order/count"),
      API.get("/wishlist")
    ])
      .then(([, cartCount, wishlistCount, orderCount, wishlistRes]) => {
        dispatch(setCartCount(cartCount.data));
        dispatch(setWishlistCount(wishlistCount.data));
        dispatch(setOrderCount(orderCount.data));
        setWishlistItems(wishlistRes.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = (id) => {
    API.delete(`/wishlist/${id}`).then(() => fetchWishlist());
  };

  const moveToCart = (shoeId, id) => {
    API.post(`/cart/add/${shoeId}`)
      .then((res) => {
        alert(res.data);
        removeFromWishlist(id);
      })
      .catch((err) => {
        if (err.response?.data) {
          alert(err.response.data);
        } else {
          alert("Error adding to cart");
        }
        console.log(err);
      });
  };

  // ✅ Loader UI
  if (loading) {
    return (
      <EmptyPage
        text="Loading Wishlist..."
        height="80vh"
        width="100%"
        fontSize="40px"
        center
      />
    );
  }

  return (
    <div className="container">
      <h2>💖 Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="mywishlist-container">
          {/* LEFT - Reminder Box */}
          <div className="mywishlist-reminder-box">
            <h3>⚠ Don’t Miss Out!</h3>
            <p>
              Items in your wishlist are in high demand. Prices may increase and stock might run out soon.
              Add them to your cart now to secure the best deal!
            </p>
            <div className="mywishlist-warning">
              🔥 Limited Stock on some items!
            </div>
            <div className="mywishlist-tip">
              💡 Tip: Moving items to cart ensures you can buy before prices change.
            </div>
            <button
              className="mywishlist-buy-btn"
              style={{ width: "100%", marginTop: "15px" }}
              onClick={() => wishlistItems.forEach(i => moveToCart(i.shoeId, i.id))}
            >
              🛒 Move All to Cart
            </button>
          </div>

          {/* RIGHT - Wishlist Items */}
          <div className="mywishlist-product-list">
            {wishlistItems.map((item) => (
              <div className="mywishlist-card" key={item.id}>
                <div className="mywishlist-image-box">
                  <img src={item.imageUrl} alt={item.shoeName} />
                </div>

                <div className="mywishlist-details-box">
                  <h3>{item.shoeName}</h3>
                  <p><b>Brand:</b> {item.brand}</p>
                  <p><b>Category:</b> {item.category}</p>

                  {item.size && (
                    <div className="mywishlist-size-list">
                      <b>Size:</b>
                      {(Array.isArray(item.size) ? item.size : [item.size]).map((sz, idx) => (
                        <span className="mywishlist-size-box" key={idx}>{sz}</span>
                      ))}
                    </div>
                  )}

                  {item.color && (
                    <div className="mywishlist-color-list">
                      <b>Color:</b>
                      {(Array.isArray(item.color) ? item.color : [item.color]).map((clr, idx) => (
                        <span
                          className="mywishlist-color-box"
                          key={idx}
                          style={{ backgroundColor: clr.toLowerCase() }}
                          title={clr}
                        ></span>
                      ))}
                    </div>
                  )}

                  <div className="mywishlist-price-info">
                    <span>MRP: <s>₹{item.salePrice}</s></span>
                    <span style={{ color: "red", fontWeight: "500" }}>({item.discountPercent}% OFF)</span>
                    <span>Now: ₹{item.salePriceWithDiscount}</span>
                  </div>

                  <p className="mywishlist-urgency">
                    ⏳ {item.stock}! Only a few left! Order soon to grab the deal.
                  </p>

                  <div className="mywishlist-actions-inline">
                    <button
                      className="mywishlist-buy-btn"
                      onClick={() => moveToCart(item.shoeId, item.id)}
                    >
                      🛒 Move to Cart
                    </button>
                    <button
                      className="mywishlist-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default Wishlist;
