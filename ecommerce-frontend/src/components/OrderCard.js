import { Link } from "react-router-dom";
import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-card-products">
        {order.items.map((item) => (
          <img
            key={item._id || item.productId}
            src={item.imageUrl}
            alt={item.name}
            className="order-card-image"
          />
        ))}
      </div>

      <h2>Order ID: {order._id}</h2>

      <p>
        Date:{" "}
        {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </p>

      <p>
        Items: {order.items.length}
      </p>

      <p>
        Total: ₹
        {order.totalAmount.toLocaleString("en-IN")}
      </p>

      <OrderStatus status={order.status} />

      <Link
        to={`/orders/${order._id}`}
        className="order-details-link"
      >
        View Details
      </Link>
    </div>
  );
}

export default OrderCard;