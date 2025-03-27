import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { toast } from "react-toastify";
import { Button, Space, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { FiHome, FiLogIn, FiUser } from "react-icons/fi";
import Footer from "../components/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { Title } = Typography;
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?._id;
        if (userId) fetchProfile(userId);
      } catch (error) {
        setError("Invalid session. Please login again.");
        setLoading(false);
      }
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async (userId) => {
    try {
      const res = await axios.get(`/api/v1/users/getuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (
      toast.success("Permanently delete your account? This cannot be undone!")
    ) {
      try {
        await axios.delete(`/api/v1/users/deleteuser/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        setError("Failed to delete account. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="profile-app">
      {/* Premium Glass Header */}
      <Header className="upload-header-nav">
        <div className="header-content">
          <Title level={3} className="logo">
            ResumeGenius
          </Title>
          <Space size="large">
            <Button type="text" onClick={() => navigate("/")} icon={<FiHome />}>
              Home
            </Button>
            <Button
              type="text"
              onClick={() => navigate("/profile")}
              icon={<FiUser />}
            >
              Profile
            </Button>
            <Button
              type="primary"
              shape="round"
              onClick={() => navigate("/login")}
              icon={<FiLogIn />}
              style={{
                background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
                border: "none",
              }}
            >
              Login
            </Button>
          </Space>
        </div>
      </Header>

      <main className="profile-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>{error}</h3>
            <button
              className="action-btn primary"
              onClick={() => navigate("/login")}
            >
              Return to Login
            </button>
          </div>
        ) : user ? (
          <div className="profile-card">
            <div className="card-header">
              <div className="user-avatar">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h2>{user.name || "User Profile"}</h2>
                <p className="user-role">{user.role || "Premium Member"}</p>
              </div>
            </div>

            <div className="card-body">
              <div className="info-section">
                <div className="info-row">
                  <span className="info-icon">🆔</span>
                  <div>
                    <label>User ID</label>
                    <p>{user._id}</p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon">✉️</span>
                  <div>
                    <label>Email Address</label>
                    <p>
                      {user.email}
                      {user.verified && (
                        <span className="verified-tag">Verified</span>
                      )}
                    </p>
                  </div>
                </div>

                {user.createdAt && (
                  <div className="info-row">
                    <span className="info-icon">📅</span>
                    <div>
                      <label>Member Since</label>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="action-section">
                <button className="action-btn danger" onClick={deleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No user data available</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
