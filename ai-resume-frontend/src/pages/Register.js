import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      <div className="input-container">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-container">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validatePassword}
          required
        />
      </div>

      <div className="input-container">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={validatePassword}
          required
        />
        {passwordError && (
          <span className="password-match-error">{passwordError}</span>
        )}
      </div>

      <button
        onClick={handleRegister}
        disabled={loading || passwordError}
        className={`register-button ${loading ? "loading" : ""}`}
      >
        {loading ? "Registering..." : "Create Account"}
      </button>
    </div>
  );
};

export default Register;
