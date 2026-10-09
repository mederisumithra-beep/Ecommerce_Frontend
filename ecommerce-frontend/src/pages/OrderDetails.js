import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderStatus from "../components/OrderStatus";
import OrderItem from "../components/OrderItem";

function OrderDetails() {
  const { id } = useParams();
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
          `http://localhost:5000/order/${id}`,
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

    if (id && token) {
      fetchOrder();
    }
  }, [id, token]);

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-message">
          <h1>Order Details</h1>
          <p>Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-details-page">
        <div className="order-message">
          <h1>Order Details</h1>
          <p>{error}</p>

          <Link to="/orders" className="order-button">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-message">
          <h1>Order Details</h1>
          <p>Order not found.</p>

          <Link to="/orders" className="order-button">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">

      <div className="order-details-header">
        <h1>Order Details</h1>
        <p>Thank you for your order!</p>
      </div>

      <section className="order-summary-card">

        <div>
          <span>Order ID</span>
          <strong>{order._id}</strong>
        </div>

        <div>
          <span>Order Date</span>
          <strong>
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </strong>
        </div>

        <div>
          <span>Status</span>
          <OrderStatus status={order.status} />
        </div>

      </section>

      <section className="ordered-items-section">

        <h2>Ordered Items</h2>

        {order.items.map((item) => (
          <OrderItem
            key={item.productId}
            item={item}
          />
        ))}

      </section>

      <section className="order-total-card">

        <span>Order Total</span>

        <strong>
          ₹{order.totalAmount.toLocaleString("en-IN")}
        </strong>

      </section>

      <section className="delivery-card">

        <h2>Delivery Information</h2>

        <p>{order.shippingAddress}</p>

      </section>

      <div className="order-actions">

        <Link to="/orders" className="order-button">
          Back to Orders
        </Link>

        <Link to="/products" className="order-button gold-button">
          Continue Shopping
        </Link>

      </div>

    </main>
  );
}

export default OrderDetails;