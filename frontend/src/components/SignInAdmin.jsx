import React, { useState } from "react";
import "../SignIn.css";
import { useNavigate } from "react-router-dom";

const SignInAdmin = () => {
  console.log("omkar@admin.com")
  console.log("Siddhi@24")
  const [email, setEmail] = useState("");  // ✅ email state
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      email,      // ✅ correct key for backend
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      console.log("✅ Login successful:", data);
      setLoading(false);

      // If token exists, save it to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Request failed:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {/* Left Image Section */}
      <div className="signin-left">
        <img
          src="/images/banner.png"
          alt="Eduplus Banner"
          className="signin-image"
        />
      </div>

      {/* Right Login Form Section */}
      <div className="signin-right">
        <div className="signin-box">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="signin-logo"
          />
          <h2 className="signin-title">
            Admin <span className="highlight">Sign-In</span>
          </h2>

          {error && <p className="error-message">{error}</p>}
          {loading && <p className="loading-message">Signing in...</p>}

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? "Loading..." : "SIGN IN"}
            </button>
          </form>

          <a href="signin" className="forgot-password">
            Sign In as Student
          </a>

          <div className="store-buttons">
            <img src="/images/googleplay.png" alt="Google Play" />
            <img src="/images/appstore.png" alt="App Store" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInAdmin;
