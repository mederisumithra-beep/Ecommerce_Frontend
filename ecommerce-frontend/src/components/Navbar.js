import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">

      <div className="brand-logo">
       
        <h2>Mystores</h2>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/products">Categories</Link>

        {role !== "admin" && (
          <Link to="/cart">
            Cart({cartCount})
          </Link>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {isLoggedIn && (
          <Link
            to="/account"
            className="account-icon"
            title="My Account"
            aria-label="My Account"
          >
            <span>👤</span>
          </Link>
        )}

        {isLoggedIn && role !== "admin" && (
          <Link to="/orders">
            My Orders
          </Link>
        )}

        {isLoggedIn && role === "admin" && (
          <>
            <Link to="/admin">
              Admin Dashboard
            </Link>

            <Link to="/admin/orders">
              Admin Orders
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

    </nav>
  );
}

export default Navbar;