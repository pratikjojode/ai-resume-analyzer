import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css"; // External CSS

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Logo & About Section */}
        <div className="footer-brand">
          <h2 className="footer-logo" onClick={() => navigate("/")}>
            PREMIUM<span className="highlight">APP</span>
          </h2>
          <p className="footer-text">
            Experience next-level features designed for the modern user.
          </p>
        </div>

        {/* Navigation Links */}

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Premium App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
