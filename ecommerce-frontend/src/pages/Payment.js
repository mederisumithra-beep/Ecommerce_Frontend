import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state;
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!orderData) {
    return (
      <main className="payment-page">
        <div className="payment-card">
          <h1>Payment</h1>
          <p>Payment details are not available.</p>

          <button
            className="back-checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Back to Checkout
          </button>
        </div>
      </main>
    );
  }

  const handlePayment = () => {
    setPaymentSuccess(true);

    setTimeout(() => {
      navigate("/orders");
    }, 2000);
  };
if (paymentSuccess) {
  return (
    <main className="payment-page">
      <div className="payment-card payment-success-card">

        <button
          className="payment-close-button"
          onClick={() => navigate("/orders")}
          aria-label="Close"
        >
          ×
        </button>

        <div className="success-icon">
          ✓
        </div>

        <div className="payment-header">
          <p className="payment-label">PAYMENT COMPLETED</p>

          <h1>Payment Successful</h1>

          <p>
            Your payment has been completed successfully.
          </p>
        </div>

        <div className="payment-success-message">
          <strong>
            ₹{orderData.total.toLocaleString("en-IN")}
          </strong>

          <p>
            Your order has been placed successfully.
          </p>
        </div>

      </div>
    </main>
  );
}

  return (
    <main className="payment-page">
      <div className="payment-card">

        <div className="payment-header">
          <p className="payment-label">SECURE CHECKOUT</p>

          <h1>Demo Payment</h1>

          <p>
            This is a demo payment for your online store.
          </p>
        </div>

        <div className="payment-summary">
          <div>
            <span>Order Total</span>

            <strong>
              ₹{orderData.total.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="demo-payment-box">

          <div className="demo-payment-icon">
            💳
          </div>

          <h2>Demo Payment</h2>

          <p>
            No real money will be charged.
            This payment is only for demonstration purposes.
          </p>

        </div>

        <button
          className="demo-payment-button"
          onClick={handlePayment}
        >
          Pay ₹{orderData.total.toLocaleString("en-IN")}
        </button>

        <button
          className="back-checkout-button"
          onClick={() => navigate("/checkout")}
        >
          Back to Checkout
        </button>

      </div>
    </main>
  );
}

export default Payment;