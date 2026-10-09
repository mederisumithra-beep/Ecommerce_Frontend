import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const { currentUser, isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/product/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!isLoggedIn || !currentUser) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/wishlist/${currentUser}`
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const wishlistProducts = data.products || [];

        const exists = wishlistProducts.some(
          (wishlistProduct) =>
            wishlistProduct._id === id
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.log("Failed to fetch wishlist status");
      }
    };

    fetchWishlistStatus();
  }, [id, currentUser, isLoggedIn]);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    setCartMessage("");
    setCartError("");

    if (!isLoggedIn) {
      setCartError("Please login to add products to cart.");
      return;
    }

    try {
      setAddingToCart(true);

      const response = await fetch(
        "http://localhost:5000/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: currentUser,
            productId: product._id,
            quantity: quantity
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to cart"
        );
      }

      setCartMessage(
        data.message || "Product added to cart successfully"
      );

      if (addToCart) {
        addToCart(quantity);
      }
    } catch (error) {
      setCartError(error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      setWishlistMessage("Please login to use wishlist.");
      return;
    }

    if (wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistMessage("");

      if (!isWishlisted) {
        const response = await fetch(
          "http://localhost:5000/wishlist/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: currentUser,
              productId: product._id
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to add product to wishlist"
          );
        }

        setIsWishlisted(true);
        setWishlistMessage("Added to wishlist ❤️");
      } else {
        const response = await fetch(
          `http://localhost:5000/wishlist/${currentUser}/${product._id}`,
          {
            method: "DELETE"
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to remove product from wishlist"
          );
        }

        setIsWishlisted(false);
        setWishlistMessage("Removed from wishlist");
      }
    } catch (error) {
      setWishlistMessage(error.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <h1>Product Details</h1>
        <p>Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container">
        <h1>Product Not Found</h1>

        <p>
          {error || "This product does not exist."}
        </p>

        <Link to="/products">
          Back to Products
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="product-details">

        <div className="product-details-image-wrapper">

          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-details-image"
          />

          <button
            className={`product-details-wishlist ${
              isWishlisted ? "wishlisted" : ""
            }`}
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label="Wishlist"
          >
            {isWishlisted ? "♥" : "♡"}
          </button>

        </div>

        <div className="product-details-info">

          <h1>{product.name}</h1>

          <p>
            <strong>Category:</strong>{" "}
            {product.categoryId?.name}
          </p>

          <h2>
            Rs {product.price.toLocaleString("en-IN")}
          </h2>

          <p>
            <strong>Description:</strong>{" "}
            {product.description}
          </p>

          <p>
            <strong>Available Stock:</strong>{" "}
            {product.stock}
          </p>

          <div className="quantity-section">

            <h3>Quantity</h3>

            <button onClick={handleQuantityDecrease}>
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={handleQuantityIncrease}
              disabled={quantity >= product.stock}
            >
              +
            </button>

          </div>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart
              ? "Adding..."
              : "Add to Cart"}
          </button>

          {cartMessage && (
            <p>{cartMessage}</p>
          )}

          {cartError && (
            <p>{cartError}</p>
          )}

          {wishlistMessage && (
            <p>{wishlistMessage}</p>
          )}

          <br />
          <br />

          <Link to="/wishlist">
            <button className="view-wishlist-button">
              View Wishlist ❤️
            </button>
          </Link>

          <br />
          <br />

          <Link to="/products">
            Back to Products
          </Link>

        </div>

      </div>
    </main>
  );
}

export default ProductDetails;