import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import "../styles/About.css";

const About = () => {
  const navigate = useNavigate();

  const skills = [
    { name: "HTML/CSS", level: 95 },
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "UI/UX Design", level: 75 },
  ];

  const experiences = [
    {
      year: "2020 - Present",
      position: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      description:
        "Lead a team of developers to build responsive web applications using React and TypeScript.",
    },
    {
      year: "2018 - 2020",
      position: "Frontend Developer",
      company: "WebSolutions Ltd.",
      description:
        "Developed and maintained client websites using modern JavaScript frameworks.",
    },
    {
      year: "2016 - 2018",
      position: "Junior Web Developer",
      company: "Digital Creations",
      description:
        "Built responsive websites and collaborated with designers to implement UI mockups.",
    },
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="container">
          <h1 className="logo" onClick={() => navigate("/")}>
            ResumeGenius
          </h1>
          <nav className="nav-links">
            <a href="/about">About</a>
            <a href="/experience">Experience</a>
            <a href="/contact">Contact</a>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/resume")}
            >
              View Resume
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZd_Y-S4vxp30D3RdDMYOV-01TEqmnsiubIw&s"
            alt="Profile"
            className="hero-img"
          />
          <h1>Resume Genius</h1>
          <p>A web browser that brings up a solution to every resume</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/contact")}
          >
            Contact Me
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-img">
              <img
                src="https://img.freepik.com/premium-vector/epayment-concept-with-people-scene-flat-design-web-woman-making-online-transaction-paying-purchases-using-laptop-vector-illustration-social-media-banner-marketing-material_9209-13080.jpg?semt=ais_hybrid"
                alt="About Me"
              />
            </div>
            <div className="about-text">
              <p>
                ResumeGenius is an innovative platform designed to help job
                seekers create, optimize, and analyze their resumes using AI.
                Our mission is to simplify the job application process by
                providing smart tools that improve resume quality, increase
                interview chances, and save time.
              </p>

              <h3>Why Choose ResumeGenius?</h3>
              <ul>
                <li>
                  ✅ <strong>AI-Powered Analysis</strong> – Get instant feedback
                  on your resume’s strengths.
                </li>
                <li>
                  ✅ <strong>ATS Optimization</strong> – Ensure your resume
                  passes through applicant tracking systems.
                </li>
                <li>
                  ✅ <strong>Professional Templates</strong> – Choose from
                  modern, recruiter-approved designs.
                </li>
                <li>
                  ✅ <strong>Personalized Suggestions</strong> – Receive
                  tailored recommendations for improvement.
                </li>
                <li>
                  ✅ <strong>Secure & Private</strong> – Your data is encrypted
                  and never shared without consent.
                </li>
              </ul>

              <h3>Our Skills</h3>
              <div className="skills">
                {skills.map((skill, index) => (
                  <div className="skill-item" key={index}>
                    <div className="skill-name">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-progress"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience-section">
        <div className="container">
          <h2>Our Journey</h2>
          <div className="timeline">
            {experiences.map((exp, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-date">{exp.year}</div>
                  <h3>{exp.position}</h3>
                  <h4>{exp.company}</h4>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>trunaldhopte4532@gmail.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <h3>Phone</h3>
              <p>7977545166</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Location</h3>
              <p>Dy Patil Ambi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} ResumeGenius. All rights reserved.
          </p>
          <div className="social-links">
            <a href="#">
              <FaGithub />
            </a>
            <a href="#">
              <FaLinkedin />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
