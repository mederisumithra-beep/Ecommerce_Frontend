import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminOrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/order/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order"
          );
        }

        setOrder(data);
        setStatus(data.status);
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

  const handleStatusUpdate = async () => {
    if (!status || status === order.status) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/order/admin/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      setOrder(data.order);
      setStatus(data.order.status);
      setMessage("Order status updated successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-products">
        <h1>Admin Order Details</h1>
        <p>Loading order details...</p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="admin-products">
        <h1>Admin Order Details</h1>
        <p>{error}</p>
        <Link to="/admin/orders">
          <button>Back to Orders</button>
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="admin-products">
        <h1>Admin Order Details</h1>
        <p>Order not found.</p>
        <Link to="/admin/orders">
          <button>Back to Orders</button>
        </Link>
      </main>
    );
  }

  return (
    <main className="admin-products">
      <h1>Admin Order Details</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <section>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>

        <p>
          <strong>Customer:</strong> {order.userId}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN")}
        </p>

        <p>
          <strong>Current Status:</strong> {order.status}
        </p>
      </section>

      <hr />

      <h2>Ordered Items</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Item Total</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                ₹{item.price.toLocaleString("en-IN")}
              </td>
              <td>
                ₹{item.total.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>
        Total: ₹
        {order.totalAmount.toLocaleString("en-IN")}
      </h2>

      <hr />

      <h2>Delivery Information</h2>

      <p>{order.shippingAddress}</p>

      <hr />

      <h2>Update Order Status</h2>

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        disabled={updating || order.status === "cancelled"}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button
        onClick={handleStatusUpdate}
        disabled={
          updating ||
          status === order.status ||
          order.status === "cancelled"
        }
      >
        {updating ? "Updating..." : "Update Status"}
      </button>

      <br />
      <br />

      <Link to="/admin/orders">
        <button>Back to Orders</button>
      </Link>
    </main>
  );
}

export default AdminOrderDetails;