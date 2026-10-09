import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Account() {
  const {
    currentUser,
    userName,
    userEmail,
    role,
    logout
  } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <main className="account-page">
      <div className="account-card">

        <div className="account-avatar">
          <span>👤</span>
        </div>

        <h1>My Account</h1>

        <p className="account-welcome">
          Welcome to your Mystores account
        </p>

        <div className="account-details">

          <div className="account-detail-row">
            <span className="account-detail-label">
              Name
            </span>

            <span className="account-detail-value">
              {userName}
            </span>
          </div>

          <div className="account-detail-row">
            <span className="account-detail-label">
              Email
            </span>

            <span className="account-detail-value">
              {userEmail}
            </span>
          </div>

          <div className="account-detail-row">
            <span className="account-detail-label">
              User ID
            </span>

            <span className="account-detail-value">
              {currentUser}
            </span>
          </div>

          <div className="account-detail-row">
            <span className="account-detail-label">
              Account Type
            </span>

            <span className="account-detail-value">
              {role === "admin" ? "Administrator" : "Customer"}
            </span>
          </div>

        </div>

        <div className="account-actions">

          {role !== "admin" && (
            <Link to="/orders">
              <button className="account-orders-btn">
                My Orders
              </button>
            </Link>
          )}

          <button
            className="account-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </main>
  );
}

export default Account;