import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser, isLoggedIn } = useAuth();

  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!currentUser || !isLoggedIn) {
      setCart(null);
      setCartCount(0);
      setCartTotal(0);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/cart/${currentUser}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      setCart(data);

      const items = data.items || [];

      const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalQuantity);
      setCartTotal(data.grandTotal || 0);
    } catch (error) {
      console.log("Cart error:", error.message);
      setCart(null);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isLoggedIn]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}