import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderCard from "../components/OrderCard";

function Orders() {
  const { currentUser, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/order/user/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && token) {
      fetchOrders();
    }
  }, [currentUser, token]);

  if (loading) {
    return (
      <main className="container">
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>My Orders</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="container">
        <h1>My Orders</h1>
        <p>You have no orders yet.</p>
        <Link to="/products">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
        />
      ))}
    </main>
  );
}

export default Orders;