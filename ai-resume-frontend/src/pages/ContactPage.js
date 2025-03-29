import React, { useState } from "react";
import {
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import "../styles/ContactPage.css"; // Corrected import path
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <header className="about-header">
        <div className="container">
          <h1 className="logo" onClick={() => navigate("/")}>
            ResumeGenius
          </h1>

          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/experience">Experience</a>
          </nav>
        </div>
      </header>
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <span>123 Resume Street, San Francisco, CA</span>
            </div>
            <div className="info-item">
              <FaPhone className="icon" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="info-item">
              <FaEnvelope className="icon" />
              <span>contact@resumegenius.com</span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              <FaPaperPlane className="submit-icon" /> Send Message
            </button>
          </form>
        </div>
      </div>
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>ResumeGenius</h3>
              <p>
                The smart way to create, analyze, and optimize your resume for
                today's job market.
              </p>
            </div>
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#how-it-works">How It Works</a>
                </li>
                <li>
                  <a href="#team">Our Team</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} ResumeGenius. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactPage;
