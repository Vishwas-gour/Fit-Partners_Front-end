import { useState, useEffect } from "react";
import API from "../../API/API.jsx";
import RazorPayConfig from "../../Components/RazorPayConfig.jsx";
import "./css/promoPriceBox.css"

function PromoPriceBox({ cartItems, from }) {
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);


  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  

  const applyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMsg("⚠️ Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);
    
    try {
      const res = await API.get(`/promocode/${promoCode}`);
      setPromoDiscount(res.data.discountPercentage);
      setPromoMsg(`✅ Promo applied: ₹${res.data.discountPercentage} off!`);
    } catch (error) {
      console.log(error)
      setPromoDiscount(0);
      setPromoMsg("❌ Invalid promo code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const calculateSummary = () => {
    let mrpTotal = 0;
    let price = 0;
    let productDiscountTotal = 0;

    cartItems.forEach((item) => {
      const originalPrice = item.salePrice * item.quantity;
      const discountedPrice = item.salePriceWithDiscount * item.quantity;
      mrpTotal += originalPrice;
      price += discountedPrice;
      productDiscountTotal += originalPrice - discountedPrice;
    });

    const platformFee = 3.0;
    const delivery = price >= 500 ? 0 : 1.5;
    const bulkDiscount = calculateBulkDiscount();
    const total = price - promoDiscount - bulkDiscount + platformFee + delivery;

    return { mrpTotal, price, platformFee, delivery, total, productDiscountTotal, bulkDiscount };
  };

  const calculateBulkDiscount = () => {
    const count = cartItems.length;
    if (count >= 6) return 200;
    if (count >= 4) return 100;
    if (count >= 2) return 50;
    return 0;
  };

  const summary = calculateSummary();
  const totalSavings = summary.productDiscountTotal + promoDiscount + summary.bulkDiscount;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <>
      {/* Theme Toggle Button */}
      

      <div className="mycart-price-box">
        {from === "paymentForm" && (
          <div className="mycart-promo-box">
            <h4>🎫 Apply Promo Code</h4>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code like FIT50"
                disabled={isApplyingPromo}
              />
              <button onClick={applyPromo} disabled={isApplyingPromo}>
                {isApplyingPromo ? "Applying..." : "Apply"}
              </button>
            </div>
            {promoMsg && <p className="promo-message">{promoMsg}</p>}
          </div>
        )}

        <h2>🧾 Price Details</h2>
        <div className="mycart-price-detail">
          <span>MRP Total</span>
          <span>₹{summary.mrpTotal.toFixed(2)}</span>
        </div>
        <div className="mycart-price-detail">
          <span>Product Discount</span>
          <span className="discount-text">-₹{summary.productDiscountTotal.toFixed(2)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="mycart-price-detail">
            <span>Promo Discount</span>
            <span className="discount-text">-₹{promoDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="mycart-price-detail">
          <span>Platform Fee</span>
          <span>₹{summary.platformFee.toFixed(2)}</span>
        </div>
        <div className="mycart-price-detail">
          <span>Buy more & save more</span>
          <span className="discount-text">-₹{summary.bulkDiscount}</span>
        </div>
        <div className="mycart-price-detail">
          <span>Delivery Charges</span>
          <span className={summary.delivery === 0 ? "free-delivery" : ""}>
            {summary.delivery === 0 ? "Free" : `₹${summary.delivery.toFixed(2)}`}
          </span>
        </div>
        <hr />
        <div className="mycart-price-detail total">
          <b>Total Amount</b>
          <b>₹{summary.total.toFixed(2)}</b>
        </div>
        <div className="mycart-price-detail savings-highlight">
          🎉 You will save ₹{totalSavings.toFixed(2)} on this order
        </div>

        <p className="delivery-info">
          📦 Estimated delivery by:{" "}
          {estimatedDelivery.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </p>

        {from === "paymentForm" && (
          <RazorPayConfig amountToPay={summary.total.toFixed(2)} />
        )}
      </div>
    </>
  );
}

export default PromoPriceBox;