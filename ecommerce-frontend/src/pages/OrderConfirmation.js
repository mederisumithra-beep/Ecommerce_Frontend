import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OrderConfirmation() {
  const { orderId } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order"
          );
        }

        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token]);

  if (loading) {
    return (
      <main className="container">
        <h1>Order Confirmation</h1>
        <p>Loading order...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Order Confirmation</h1>
        <p>{error}</p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container">
        <h1>Order Confirmation</h1>
        <p>Order not found.</p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Order Placed Successfully!</h1>

      <p>
        Your order has been placed successfully.
      </p>

      <p>
        <strong>Order ID:</strong> {order._id}
      </p>

      <p>
        <strong>Total:</strong> ₹
        {order.totalAmount.toLocaleString("en-IN")}
      </p>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <h2>Delivery Information</h2>

      <p>{order.shippingAddress}</p>

      <br />

      <Link to="/orders">
        View My Orders
      </Link>

      <br />
      <br />

      <Link to="/products">
        Continue Shopping
      </Link>
    </main>
  );
}

export default OrderConfirmation;