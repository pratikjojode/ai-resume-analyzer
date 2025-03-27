import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import loginImage from "../images/abstract-digital-grid-black-background.jpg"; // Replace with your image path
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/upload");
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-image-container">
        <div className="image-overlay">
          <h1>Welcome Back</h1>
          <p>
            Unlock your career potential with our AI-powered resume analyzer
          </p>
        </div>
        <img src={loginImage} alt="Career growth" className="login-image" />
      </div>

      <div className="login-form-container">
        <div className="login-form">
          <div className="logo">
            <span>Resume</span>Genius
          </div>
          <h2>Sign In</h2>
          <p className="form-subtitle">
            Enter your credentials to access your account
          </p>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-field">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-field">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`login-button ${loading ? "loading" : ""}`}
          >
            <FiLogIn className="button-icon" />
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
