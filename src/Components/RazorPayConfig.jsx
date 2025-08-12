import { useEffect } from "react";
import API from "../API/API";
import "./css/razorPay.css"

function RazorPayConfig({ amountToPay }) {
  const email = localStorage.getItem("email");


  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {

      const deliveryCheck = await API.get("/order/available-delivery-boy");
      if (!deliveryCheck.data) {
        alert("❌ Sorry! No delivery available for your area.");
        return;
      } else {
        console.log(true);
      }



      const res = await API.post("payment/create-order", {
        amountToPay: amountToPay, currency: "INR"
      })


      console.log("after payment/create-order", res.data)

      const { orderId, razorpayKey } = res.data;

      const options = {
        key: razorpayKey,
        amount: amountToPay * 100,
        currency: "INR",
        name: "Fit-partners",
        description: "Order Payment",
        order_id: orderId,
        // call by razorpy only when payment success
        handler: async (response) => {
          await API.post("payment/verify", {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            username: email,
          });

          if (confirm("do you want to revem shoes from cart")) {
            API.delete("/cart/clear").then((res) => {
              alert(res.data);
            }).catch(err => {
              alert(err)
            })
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      console.log(options)
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button className="mycart-buy-btn" onClick={handlePayment}>
      Payment
    </button>

  )
}

export default RazorPayConfig;