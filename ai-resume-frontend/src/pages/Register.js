import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUserPlus, FiArrowRight } from "react-icons/fi";
import registerImage from "../images/abstract-digital-grid-black-background.jpg"; // Replace with your image path
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/register", {
        email,
        password,
      });

      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="register-page">
      <div className="register-image-container">
        <div className="image-overlay">
          <h1>Join Us Today</h1>
          <p>
            Unlock your career potential with our AI-powered resume analysis
            platform
          </p>
          <div className="benefits-list">
            <div className="benefit-item">
              <FiArrowRight className="benefit-icon" />
              <span>AI-powered resume analysis</span>
            </div>
            <div className="benefit-item">
              <FiArrowRight className="benefit-icon" />
              <span>ATS optimization tools</span>
            </div>
            <div className="benefit-item">
              <FiArrowRight className="benefit-icon" />
              <span>Personalized career insights</span>
            </div>
          </div>
        </div>
        <img
          src={registerImage}
          alt="Career growth"
          className="register-image"
        />
      </div>

      <div className="register-form-container">
        <div className="register-form">
          <div className="logo">
            <span>Resume</span>Genius
          </div>
          <h2>Create Account</h2>
          <p className="form-subtitle">
            Get started with your free account today
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
                onBlur={validatePassword}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-field">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validatePassword}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading || passwordError}
            className={`register-button ${loading ? "loading" : ""} ${
              passwordError ? "error-state" : ""
            }`}
          >
            <FiUserPlus className="button-icon" />
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="terms-agreement">
            By creating an account, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>
          </div>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
