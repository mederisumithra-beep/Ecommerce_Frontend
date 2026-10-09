import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/order/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
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

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <main className="admin-products">
        <h1>Admin Orders</h1>
        <p>Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-products">
        <h1>Admin Orders</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="admin-products">
        <h1>Admin Orders</h1>
        <p>No orders found.</p>
      </main>
    );
  }

  return (
    <main className="admin-products">
      <h1>Admin Orders</h1>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>{order.userId}</td>

                <td>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("en-IN")}
                </td>

                <td>
                  {order.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </td>

                <td>
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </td>

                <td>{order.status}</td>

                <td>
                  <Link to={`/admin/orders/${order._id}`}>
                    <button>View Details</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <Link to="/admin">
        <button>Back to Dashboard</button>
      </Link>
    </main>
  );
}

export default AdminOrders;
