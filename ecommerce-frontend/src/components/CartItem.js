function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  if (!item || !item.product) {
    return (
      <div className="cart-item">
        <div>
          <h3>Product no longer available</h3>

          <p>
            This product is no longer available.
          </p>
        </div>

        <button onClick={() => onRemove(item.cartId)}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="cart-item">
      <div>
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="cart-item-image"
        />

        <h3>{item.product.name}</h3>

        <p>
          Price: ₹
          {item.price.toLocaleString("en-IN")}
        </p>

        <div className="cart-quantity">
          <button
            onClick={() =>
              onDecrease(item.cartId)
            }
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              onIncrease(item.cartId)
            }
          >
            +
          </button>
        </div>

        <p>
          Item Total: ₹
          {item.itemTotal.toLocaleString("en-IN")}
        </p>
      </div>

      <button
        onClick={() =>
          onRemove(item.cartId)
        }
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;