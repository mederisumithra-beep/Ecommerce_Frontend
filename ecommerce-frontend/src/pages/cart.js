import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

function Cart() {
  const { currentUser } = useAuth();
  const { refreshCart } = useCart();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/cart/${currentUser}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      setCart(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser, fetchCart]);

  const updateQuantity = async (cartId, quantity) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/cart/${cartId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update quantity"
        );
      }

      await fetchCart();
      await refreshCart();
    } catch (error) {
      setError(error.message);
    }
  };
const handleIncrease = (cartId) => {
  const item = cart.items.find(
    (item) => item.cartId === cartId
  );

  if (!item || !item.product) {
    return;
  }

  if (item.quantity < item.product.stock) {
    updateQuantity(
      cartId,
      item.quantity + 1
    );
  }
};
 

  const handleDecrease = (cartId) => {
    const item = cart.items.find(
      (item) => item.cartId === cartId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      updateQuantity(cartId, item.quantity - 1);
    }
  };

  const handleRemove = async (cartId) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/cart/${cartId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove item"
        );
      }

      await fetchCart();
      await refreshCart();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear the cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/cart/user/${currentUser}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to clear cart"
        );
      }

      await fetchCart();
      await refreshCart();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <h1>Shopping Cart</h1>
        <p>Loading cart...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Shopping Cart</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="container">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Shopping Cart</h1>

      {cart.items.map((item) => (
        <CartItem
          key={item.cartId}
          item={item}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      ))}

      <h2>
        Grand Total: ₹
        {cart.grandTotal.toLocaleString("en-IN")}
      </h2>

      <button onClick={handleClearCart}>
        Clear Cart
      </button>
      <br />
<br />

<Link to="/checkout" className="checkout-link">
  <button>Proceed to Checkout</button>
</Link>
    </main>
  );
}

export default Cart;