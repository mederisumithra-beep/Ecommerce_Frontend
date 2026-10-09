import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        setError("");

        const cartResponse = await fetch(
          `http://localhost:5000/cart/${currentUser}`
        );

        const cartData = await cartResponse.json();

        if (!cartResponse.ok) {
          throw new Error(
            cartData.message || "Failed to fetch cart"
          );
        }

        setCart(cartData);

        const addressResponse = await fetch(
          `http://localhost:5000/address/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const addressData = await addressResponse.json();

        if (!addressResponse.ok) {
          throw new Error(
            addressData.message || "Failed to fetch addresses"
          );
        }

        setAddresses(addressData.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCheckoutData();
    }
  }, [currentUser, token]);

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);

    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });

    setFormError("");
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setSelectedAddressId("");
    setFormError("");
    setError("");
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setFormError("");
    setError("");

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setFormError("Please fill all delivery details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setFormError("Phone number must be 10 digits.");
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setFormError("Pincode must be 6 digits.");
      return;
    }

    try {
      setPlacingOrder(true);

      const shippingAddress =
        `${formData.name}, ${formData.phone}, ` +
        `${formData.address}, ${formData.city}, ` +
        `${formData.state} - ${formData.pincode}`;

      const response = await fetch(
        "http://localhost:5000/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            shippingAddress: shippingAddress
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      if (!data.order || !data.order._id) {
        throw new Error(
          "Order was not created successfully."
        );
      }

      navigate("/payment", {
        state: {
          orderId: data.order._id,
          total: cart.grandTotal
        }
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">
          <h1>Checkout</h1>
          <p>Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">
          <h1>Checkout</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>
          Review your order and enter delivery details
        </p>
      </div>

      <div className="checkout-layout">

        <section className="checkout-summary-card">

          <h2>Order Summary</h2>

          <div className="checkout-items">

            {cart.items.map((item) => (
              <div
                className="checkout-item"
                key={item.cartId}
              >

                <div className="checkout-item-image">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />
                  ) : (
                    <div className="checkout-no-image">
                      No Image
                    </div>
                  )}
                </div>

                <div className="checkout-item-info">

                  <h3>{item.product.name}</h3>

                  <p>
                    Price: ₹
                    {item.price.toLocaleString("en-IN")}
                  </p>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <strong>
                    Item Total: ₹
                    {item.itemTotal.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>
            ))}

          </div>

          <div className="checkout-total">
            <span>Order Total</span>

            <strong>
              ₹
              {cart.grandTotal.toLocaleString("en-IN")}
            </strong>
          </div>

        </section>

        <section className="checkout-delivery-card">

          <h2>Delivery Details</h2>

          {addresses.length > 0 && (
            <div className="checkout-saved-addresses">

              <h3>Select Saved Address</h3>

              <div className="checkout-address-list">

                {addresses.map((item) => (
                  <button
                    type="button"
                    key={item._id}
                    className={
                      selectedAddressId === item._id
                        ? "checkout-address-card selected"
                        : "checkout-address-card"
                    }
                    onClick={() =>
                      handleAddressSelect(item)
                    }
                  >

                    <div>
                      <strong>{item.name}</strong>

                      <p>
                        {item.phone}
                      </p>

                      <p>
                        {item.address}
                      </p>

                      <p>
                        {item.city}, {item.state} -{" "}
                        {item.pincode}
                      </p>
                    </div>

                    {selectedAddressId === item._id && (
                      <span className="selected-address-mark">
                        ✓
                      </span>
                    )}

                  </button>
                ))}

              </div>

              <p className="checkout-address-note">
                Select a saved address or edit the details below.
              </p>

            </div>
          )}

          <form onSubmit={handlePlaceOrder}>

            <div className="checkout-form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="checkout-form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                maxLength="10"
              />
            </div>

            <div className="checkout-form-group">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter delivery address"
                rows="4"
              />
            </div>

            <div className="checkout-form-row">

              <div className="checkout-form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="checkout-form-group">
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

            <div className="checkout-form-group">
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

            {formError && (
              <p className="checkout-error">
                {formError}
              </p>
            )}

            {error && (
              <p className="checkout-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="place-order-button"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Processing..."
                : "Continue to Payment"}
            </button>

          </form>

        </section>

      </div>

    </main>
  );
}

export default Checkout;