import { useEffect, useState } from "react";

function Wishlist() {
  const currentUser = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/wishlist/${currentUser}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch wishlist"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && currentUser) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, currentUser]);

  const handleRemove = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/wishlist/${currentUser}/${productId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove product"
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewDetails = (productId) => {
    window.location.assign(`/products/${productId}`);
  };

  const handleContinueShopping = () => {
    window.location.assign("/products");
  };

  const handleLogin = () => {
    window.location.assign("/login");
  };

  if (!isLoggedIn) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-heading">
          <h1>My Wishlist</h1>
          <span>♥</span>
        </div>

        <div className="empty-wishlist">
          <div className="empty-heart">♡</div>
          <h2>Please Login</h2>
          <p>Login to view your wishlist.</p>

          <button
            className="wishlist-main-btn"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-heading">
          <h1>My Wishlist</h1>
          <span>♥</span>
        </div>

        <p className="wishlist-message">
          Loading wishlist...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-heading">
          <h1>My Wishlist</h1>
          <span>♥</span>
        </div>

        <p className="wishlist-message">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-heading">
        <h1>My Wishlist</h1>
        <span>♥</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-heart">♡</div>

          <h2>Your wishlist is empty</h2>

          <p>
            Add products you love to your wishlist.
          </p>

          <button
            className="wishlist-main-btn"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div
              className="wishlist-card"
              key={product._id}
            >
              <div className="wishlist-image-wrapper">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="wishlist-product-image"
                />

                <span className="wishlist-filled-heart">
                  ♥
                </span>
              </div>

              <div className="wishlist-product-info">
                <h3>{product.name}</h3>

                <p className="wishlist-category">
                  {product.categoryId?.name ||
                    product.category ||
                    "Product"}
                </p>

                <h4>
                  Rs {product.price.toLocaleString("en-IN")}
                </h4>

                <div className="wishlist-actions">
                  <button
                    className="wishlist-view-btn"
                    onClick={() =>
                      handleViewDetails(product._id)
                    }
                  >
                    View Details
                  </button>

                  <button
                    className="remove-wishlist-btn"
                    onClick={() =>
                      handleRemove(product._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;