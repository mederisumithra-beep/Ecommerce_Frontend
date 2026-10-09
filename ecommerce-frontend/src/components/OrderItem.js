function OrderItem({ item }) {
  return (
    <div className="order-item">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="order-item-image"
      />

      <div className="order-item-details">
        <h3>{item.name}</h3>

        <p>
          <strong>Quantity:</strong> {item.quantity}
        </p>

        <p>
          <strong>Price:</strong> ₹
          {item.price.toLocaleString("en-IN")}
        </p>

        <p>
          <strong>Item Total:</strong> ₹
          {item.total.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

export default OrderItem;