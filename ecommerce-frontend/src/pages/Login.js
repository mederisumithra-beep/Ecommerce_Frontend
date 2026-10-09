import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password should contain at least 6 characters";
    }

    setErrors(newErrors);
    setSuccess("");

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:5000/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || data.status === false) {
          throw new Error(data.message || "Login failed");
        }

        login(
          data.data.token,
          data.data.id,
          data.data.role,
          data.data.name,
          data.data.email
        );

        setSuccess(
          data.message || "Login successful!"
        );

        setTimeout(() => {
          navigate("/products");
        }, 1000);

      } catch (error) {
        setErrors({
          submit: error.message,
        });
      }
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        <h1>Login</h1>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="login-field">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="login-error">
                {errors.email}
              </p>
            )}

          </div>

          <div className="login-field">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            {errors.password && (
              <p className="login-error">
                {errors.password}
              </p>
            )}

          </div>

          {errors.submit && (
            <p className="login-error">
              {errors.submit}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        {success && (
          <p className="login-success">
            {success}
          </p>
        )}

        <p className="login-register">
          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;