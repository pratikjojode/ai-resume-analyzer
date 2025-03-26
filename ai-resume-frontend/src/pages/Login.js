import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import the toast component
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful");
      navigate("/upload");
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred"); // Error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="input-container">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        onClick={handleLogin}
        disabled={loading}
        className={`login-button ${loading ? "loading" : ""}`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
