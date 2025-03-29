import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaChartLine,
  FaShieldAlt,
  FaLightbulb,
  FaUserTie,
  FaRocket,
  FaUser,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Avatar } from "antd";
import "../styles/HomePage.css";

const Home = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Features data
  const features = [
    {
      icon: <FaUpload className="feature-icon" />,
      title: "Easy Upload",
      description:
        "Simply upload your resume in any format and let our AI analyze it instantly.",
    },
    {
      icon: <FaChartLine className="feature-icon" />,
      title: "Smart Analysis",
      description:
        "Get detailed insights about your resume's strengths and areas for improvement.",
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Privacy Focused",
      description:
        "Your documents are processed securely and never stored without permission.",
    },
    {
      icon: <FaLightbulb className="feature-icon" />,
      title: "AI Suggestions",
      description:
        "Receive personalized recommendations to make your resume stand out.",
    },
    {
      icon: <FaUserTie className="feature-icon" />,
      title: "ATS Optimization",
      description:
        "Ensure your resume passes through Applicant Tracking Systems.",
    },
    {
      icon: <FaRocket className="feature-icon" />,
      title: "Quick Results",
      description: "Get comprehensive feedback in seconds, not hours.",
    },
  ];

  // Team members
  const teamMembers = [
    {
      name: "Trunal Dhopte",
      role: "Frontend Developer",
      avatar: <Avatar size={64} icon={<FaUser />} />,
    },
    {
      name: "Gauri Garate",
      role: "UI/UX Designer",
      avatar: <Avatar size={64} icon={<FaUser />} />,
    },
    {
      name: "Pratik Jojode",
      role: "Backend Developer",
      avatar: <Avatar size={64} icon={<FaUser />} />,
    },
    {
      name: "Gunn Dewangan",
      role: "Project Manager",
      avatar: <Avatar size={64} icon={<FaUser />} />,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "ResumeGenius helped me land 3 interviews in just 2 weeks!",
      author: "Sarah K., Software Engineer",
    },
    {
      quote: "The AI suggestions dramatically improved my resume's impact.",
      author: "Michael T., Marketing Manager",
    },
    {
      quote: "Finally a tool that actually understands what recruiters want!",
      author: "Emma R., UX Designer",
    },
  ];

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: "Upload Your Resume",
      description: "Drag and drop your resume file in any format",
      icon: <FaUpload className="step-icon" />,
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our system evaluates your resume against key metrics",
      icon: <FaChartLine className="step-icon" />,
    },
    {
      step: 3,
      title: "Get Recommendations",
      description: "Receive actionable suggestions to improve each section",
      icon: <FaCheckCircle className="step-icon" />,
    },
    {
      step: 4,
      title: "Download & Apply",
      description: "Export your polished resume and start applying",
      icon: <FaUserTie className="step-icon" />,
    },
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="container">
          <h1 className="logo" onClick={() => navigate("/")}>
            ResumeGenius
          </h1>

          {/* Hamburger Menu Button */}
          <button className="hamburger-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#team">Our Team</a>
            <a href="/about">About</a>
            <button
              className=" btn try-btn"
              onClick={() => navigate("/upload")}
            >
              Try Now
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <a href="#features" onClick={toggleSidebar}>
            Features
          </a>
          <a href="#how-it-works" onClick={toggleSidebar}>
            How It Works
          </a>
          <a href="#team" onClick={toggleSidebar}>
            Our Team
          </a>
          <a href="/about" onClick={toggleSidebar}>
            About
          </a>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/upload");
              toggleSidebar();
            }}
          >
            Try Now
          </button>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Transform Your Resume With AI</h1>
          <p className="hero-subtitle">
            Get expert-level resume analysis and optimization in seconds - for
            free
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/upload")}
            >
              Analyze Your Resume
            </button>
            <button className="btn btn-outline">Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Resumes Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Interview Rate Increase</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2>Why Choose ResumeGenius</h2>
          <p className="section-subtitle">
            Everything you need to create a resume that stands out in today's
            competitive job market
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon-container">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">
            Our proven process increases interview callback rates by 3x on
            average
          </p>
          <div className="steps-container">
            {processSteps.map((step, index) => (
              <div className="step-item" key={index}>
                <div className="step-number">{step.step}</div>
                <div className="step-icon-container">{step.icon}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <div className="container">
          <h2>Our Team</h2>
          <p className="section-subtitle">
            The talented individuals behind ResumeGenius
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default Home;
