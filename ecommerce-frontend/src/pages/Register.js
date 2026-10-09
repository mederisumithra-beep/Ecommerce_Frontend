import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password should contain at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);
    setSuccess("");

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:5000/user/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || data.status === false) {
          throw new Error(
            data.message || "Registration failed"
          );
        }

        setSuccess(
          data.message || "Registration successful!"
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        setErrors({
          submit: error.message,
        });
      }
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">

        <div className="register-form-box">

          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            <div className="register-field">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

              {errors.name && (
                <p className="register-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="register-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="register-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="register-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              {errors.phone && (
                <p className="register-error">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="register-field">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              {errors.password && (
                <p className="register-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="register-field">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />

              {errors.confirmPassword && (
                <p className="register-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.submit && (
              <p className="register-error">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>

          {success && (
            <p className="register-success">
              {success}
            </p>
          )}

          <p className="register-login">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

        <div className="register-title-section">

          <div className="register-title-icon">
            👤
          </div>

          <div className="register-title-line"></div>

          <h1>Create Account</h1>

          <div className="register-title-line"></div>

          <div className="register-title-diamond">
            ◆
          </div>

        </div>

      </div>
    </main>
  );
}

export default Register;