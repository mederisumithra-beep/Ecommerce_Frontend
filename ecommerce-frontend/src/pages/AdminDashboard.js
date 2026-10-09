import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
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

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.status === "confirmed" ||
      order.status === "processing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  if (loading) {
    return (
      <main className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-error-box">
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">

      <section className="admin-dashboard-header">
        <p className="admin-label">ADMIN PANEL</p>

        <h1>Admin Dashboard</h1>

        <p className="admin-subtitle">
          Manage your store, products, categories and orders
        </p>
      </section>

      <section className="admin-stat-grid">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div>
            <p>Total Orders</p>
            <h2>{totalOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">⏳</div>
          <div>
            <p>Pending</p>
            <h2>{pendingOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🔄</div>
          <div>
            <p>Processing</p>
            <h2>{processingOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">✓</div>
          <div>
            <p>Delivered</p>
            <h2>{deliveredOrders}</h2>
          </div>
        </div>

      </section>

      <section className="admin-quick-section">

        <div className="admin-section-heading">
          <p className="admin-label">MANAGEMENT</p>
          <h2>Quick Actions</h2>
          <p>Choose an area to manage your store</p>
        </div>

        <div className="admin-action-grid">

          <Link
            to="/admin/products"
            className="admin-action-card"
          >
            <div className="admin-action-icon">🛍️</div>

            <div className="admin-action-content">
              <h3>Products</h3>
              <p>
                Add, edit and manage your products
              </p>
            </div>

            <span className="admin-arrow">→</span>
          </Link>

          <Link
            to="/admin/categories"
            className="admin-action-card"
          >
            <div className="admin-action-icon">▦</div>

            <div className="admin-action-content">
              <h3>Categories</h3>
              <p>
                Manage your product categories
              </p>
            </div>

            <span className="admin-arrow">→</span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-action-card"
          >
            <div className="admin-action-icon">🧾</div>

            <div className="admin-action-content">
              <h3>Orders</h3>
              <p>
                View and manage customer orders
              </p>
            </div>

            <span className="admin-arrow">→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;