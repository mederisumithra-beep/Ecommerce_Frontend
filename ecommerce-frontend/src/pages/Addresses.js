import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Addresses() {
  const { currentUser, token } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/address/${currentUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch addresses"
        );
      }

      setAddresses(data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("Please fill all address details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setError("Pincode must be 6 digits.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/address/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: currentUser,
            ...formData
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add address"
        );
      }

      setMessage(
        data.message || "Address added successfully"
      );

      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
      });

      fetchAddresses();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/address/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete address"
        );
      }

      setMessage(
        data.message || "Address deleted successfully"
      );

      fetchAddresses();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="addresses-page">
      <div className="addresses-container">

        <div className="addresses-header">
          <h1>My Addresses</h1>
          <p>
            Add and manage your delivery addresses
          </p>
        </div>

        <section className="address-form-card">
          <h2>Add New Address</h2>

          <form onSubmit={handleSubmit}>

            <div className="address-form-row">
              <div className="address-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="address-form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="address-form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="4"
              />
            </div>

            <div className="address-form-row">

              <div className="address-form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="address-form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>

            </div>

            <div className="address-form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter 6 digit pincode"
                maxLength="6"
              />
            </div>

            {error && (
              <p className="address-error">
                {error}
              </p>
            )}

            {message && (
              <p className="address-success">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="add-address-button"
            >
              Add Address
            </button>

          </form>
        </section>

        <section className="saved-addresses-section">
          <h2>Saved Addresses</h2>

          {loading ? (
            <div className="address-message">
              <p>Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="address-message">
              <p>No saved addresses yet.</p>
            </div>
          ) : (
            <div className="address-list">

              {addresses.map((item) => (
                <div
                  className="address-card"
                  key={item._id}
                >

                  <div className="address-card-content">
                    <h3>{item.name}</h3>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {item.phone}
                    </p>

                    <p>{item.address}</p>

                    <p>
                      {item.city}, {item.state} -{" "}
                      {item.pincode}
                    </p>
                  </div>

                  <div className="address-actions">
                    <button
                      className="delete-address-button"
                      onClick={() =>
                        handleDelete(item._id)
                      }
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}

            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Addresses;