import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiHome,
  FiUser,
  FiFileText,
  FiStar,
  FiTool,
  FiBriefcase,
  FiAward,
  FiBarChart2,
  FiBook,
  FiLayers,
  FiLink,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiClock,
  FiDownload,
  FiEdit2,
  FiSettings,
} from "react-icons/fi";
import "../styles/resumeDashboard.css";

const ResumeDashboard = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await axios.get(
          `/api/v1/resumes/getResume/${resumeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Failed to fetch resume data"
          );
        }

        setResumeData(response.data.data);
      } catch (err) {
        console.error("Resume fetch error:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [resumeId]);

  const missingSections =
    resumeData?.parsedData?.aiAnalysis?.missing_sections || [];

  const extractContactInfo = (rawText) => {
    if (!rawText) return {};
    const emailMatch = rawText.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i
    );
    const phoneMatch = rawText.match(/(\+?\d[\d -]{8,12}\d)/);

    return {
      name:
        rawText
          .split("\n")
          .find(
            (line) =>
              line.trim() &&
              !line.includes("@") &&
              !line.match(/(phone|email)/i)
          )
          ?.trim() || "Unknown",
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
    };
  };

  const extractProjects = () => {
    if (!resumeData?.parsedData?.aiAnalysis?.experience?.notable_projects)
      return [];

    return resumeData.parsedData.aiAnalysis.experience.notable_projects.map(
      (project) => ({
        title: project,
        description: "Key project in professional experience",
      })
    );
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading resume analysis...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );

  if (!resumeData)
    return (
      <div className="empty-state">
        <h3>No Resume Found</h3>
        <p>Upload a resume to get started</p>
        <button onClick={() => navigate("/upload")} className="upload-button">
          Upload Resume
        </button>
      </div>
    );

  const { filename, uploadedAt, parsedData } = resumeData;
  const { aiAnalysis = {}, rawText = "", preview = "" } = parsedData || {};
  const contactInfo = extractContactInfo(rawText);
  const projects = extractProjects();

  const {
    resume_quality_score,
    skills = {},
    experience = {},
    education = [],
    certifications = [],
    summary,
    job_match_percentage,
    missing_keywords = [],
    actionable_improvements = [],
    analyzedAt,
  } = aiAnalysis;

  const renderScoreBadge = (score) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="score-badge-container">
        <div
          className="circular-progress"
          style={{
            background: `conic-gradient(
            ${
              percentage >= 80
                ? "#4CAF50"
                : percentage >= 60
                ? "#FFC107"
                : "#F44336"
            } 
            ${percentage * 3.6}deg, 
            #f0f2f5 ${percentage * 3.6}deg
          )`,
          }}
        >
          <div className="progress-inner">
            <span>{score || "N/A"}</span>
          </div>
        </div>
        <div className="score-label">
          {score >= 8 ? "Excellent" : score >= 6 ? "Good" : "Needs Work"}
        </div>
      </div>
    );
  };

  const renderMatchPercentage = (percentage) => {
    return (
      <div className="match-percentage-container">
        <div className="progress-track">
          <div
            className="progress-thumb"
            style={{
              width: `${percentage}%`,
              backgroundColor:
                percentage >= 80
                  ? "#4CAF50"
                  : percentage >= 50
                  ? "#2196F3"
                  : "#F44336",
            }}
          ></div>
        </div>
        <div className="percentage-value">
          {percentage}% Match
          <span className="match-description">
            {percentage >= 80
              ? "Excellent fit"
              : percentage >= 50
              ? "Good potential"
              : "Needs optimization"}
          </span>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="resume-dashboard premium-theme">
      <main className="dashboard-main">
        <header className="home-header">
          <div className="container">
            <h1 className="logo" onClick={() => navigate("/")}>
              ResumeGenius
            </h1>

            {/* Desktop Navigation */}
            <nav className="nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#team">Our Team</a>
              <a href="/about">About</a>
              <a href="/profile">Profile</a>
            </nav>
          </div>
        </header>
        {/* Profile Overview Section */}
        <section className="profile-overview glassmorphism">
          <div className="profile-header-new">
            <div className="profile-info">
              <h2>Name:{contactInfo.name}</h2>
              <p className="profile-title">
                Experience:{experience.positions?.[0] || "Professional"}
              </p>

              <div className="contact-info">
                {contactInfo.email && (
                  <div className="contact-item">
                    <FiMail />
                    <span>Email:{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="contact-item">
                    <FiPhone />
                    <span>Contact:{contactInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-stats">
              <div className="career-level">
                <span
                  className={`level-badge ${
                    experience.career_level?.toLowerCase() || "professional"
                  }`}
                >
                  {experience.career_level || "Professional"} Level
                </span>
              </div>

              <div className="experience-years">
                <span className="years-value">
                  {experience.total_years || "0"}
                </span>
                <span className="years-label">Years Experience</span>
              </div>
            </div>
          </div>

          <div className="resume-meta">
            <div className="meta-item">
              <FiClock />
              <span>Uploaded: {formatDate(uploadedAt)}</span>
            </div>
            <div className="meta-item">
              <FiFileText />
              <span>Filename: {filename.replace(/^[0-9]+-/, "")}</span>
            </div>
            <div className="meta-item">
              <FiBarChart2 />
              <span>Last Analyzed: {formatDate(analyzedAt)}</span>
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          {/* Resume Quality Score */}
          <div className="metric-card glassmorphism">
            <div className="metric-header">
              <FiStar />
              <h3>Resume Quality</h3>
            </div>
            <div className="metric-content">
              {renderScoreBadge(resume_quality_score)}
              <p className="metric-description">
                {resume_quality_score >= 8
                  ? "Your resume is in excellent shape!"
                  : resume_quality_score >= 6
                  ? "Good resume with room for improvement"
                  : "Consider optimizing your resume"}
              </p>
            </div>
          </div>

          {/* Job Match Percentage */}
          <div className="metric-card glassmorphism">
            <div className="metric-header">
              <FiBriefcase />
              <h3>Job Match</h3>
            </div>
            <div className="metric-content">
              {renderMatchPercentage(job_match_percentage)}
              <div className="industries-list">
                {experience.industries?.slice(0, 3).map((industry, i) => (
                  <span key={i} className="industry-tag">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Overview */}
          <div className="metric-card glassmorphism">
            <div className="metric-header">
              <FiAward />
              <h3>Experience</h3>
            </div>
            <div className="metric-content">
              <div className="positions-list">
                {experience.positions?.map((position, i) => (
                  <div key={i} className="position-item">
                    <div className="position-bullet"></div>
                    <span>{position}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          <div className="metric-card glassmorphism">
            <div className="metric-header">
              <FiTool />
              <h3>Top Skills</h3>
            </div>
            <div className="metric-content">
              <div className="skills-preview">
                {skills.technical?.slice(0, 6).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div className="content-column">
            {/* Professional Summary */}
            <section className="content-card glassmorphism">
              <div className="card-header new">
                <FiFileText />
                <h3>Professional Summary</h3>
              </div>
              <div className="card-content">
                <p className="summary-text">
                  {summary || "No professional summary available."}
                </p>
              </div>
            </section>

            {/* Skills Section */}
            <section className="content-card glassmorphism">
              <div className="card-header">
                <FiTool />
                <h3>Skills Breakdown</h3>
              </div>
              <div className="card-content">
                <div className="skills-section">
                  <h4>Technical Skills</h4>
                  <div className="skills-grid">
                    {skills.technical?.length > 0 ? (
                      skills.technical.map((skill, i) => (
                        <span key={i} className="skill-tag technical">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="no-data">No technical skills found</p>
                    )}
                  </div>

                  <h4>Soft Skills</h4>
                  <div className="skills-grid">
                    {skills.soft_skills?.length > 0 ? (
                      skills.soft_skills.map((skill, i) => (
                        <span key={i} className="skill-tag soft">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="no-data">No soft skills found</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Education */}
            {education.length > 0 && (
              <section className="content-card glassmorphism">
                <div className="card-header">
                  <FiBook />
                  <h3>Education</h3>
                </div>
                <div className="card-content">
                  <div className="education-list">
                    {education.map((edu, i) => (
                      <div key={i} className="education-item">
                        <div className="education-icon">
                          <div className="icon-circle"></div>
                          {i !== education.length - 1 && (
                            <div className="timeline-connector"></div>
                          )}
                        </div>
                        <div className="education-details">
                          <h4>{edu.split(",")[0]}</h4>
                          <p className="institution">{edu.split(",")[1]}</p>
                          <p className="duration">{edu.split(",")[2]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="content-column">
            {/* Projects */}
            {projects.length > 0 && (
              <section className="content-card glassmorphism">
                <div className="card-header">
                  <FiLayers />
                  <h3>Notable Projects</h3>
                </div>
                <div className="card-content">
                  <div className="projects-list">
                    <ul>
                      {projects.map((project, i) => (
                        <li key={i} className="project-item">
                          <h4>
                            {i + 1}. {project.title}
                          </h4>
                          <p>{project.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="content-card glassmorphism">
                <div className="card-header">
                  <FiAward />
                  <h3>Certifications</h3>
                </div>
                <div className="card-content">
                  <table className="certifications-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Certification</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certifications.map((cert, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{cert}</td>
                          <td>
                            <button className="view-cert">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Recommendations */}
            <section className="content-card glassmorphism">
              <div className="card-header">
                <FiBarChart2 />
                <h3>Optimization Recommendations</h3>
              </div>
              <div className="card-content">
                <div className="recommendations-section">
                  <h4>Missing Keywords</h4>
                  <div className="keywords-grid">
                    {missing_keywords.length > 0 ? (
                      missing_keywords.map((keyword, i) => (
                        <span key={i} className="keyword-tag">
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <p className="no-data">No missing keywords detected</p>
                    )}
                  </div>

                  <h4>Actionable Improvements</h4>
                  <div className="improvements-table-container">
                    {actionable_improvements.length > 0 ? (
                      <table className="improvements-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Improvement Suggestion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionable_improvements.map((suggestion, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{suggestion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-data">No suggestions available</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Missing Sections */}
            {missingSections.length > 0 && (
              <section className="content-card glassmorphism">
                <div className="card-header">
                  <FiAlertCircle />
                  <h3>Missing Sections</h3>
                </div>
                <div className="card-content">
                  <div className="missing-sections-list">
                    {missingSections.map((section, i) => (
                      <div key={i} className="missing-section-item">
                        <div className="warning-icon">!</div>
                        <p>{section}</p>
                      </div>
                    ))}
                  </div>
                  <button className="add-sections-btn">
                    Add Missing Sections
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Raw Text Preview */}
        <section className="content-card glassmorphism full-width">
          <div className="card-header">
            <FiFileText />
            <h3>Resume Content</h3>
          </div>
          <div className="card-content">
            <div className="raw-text-container">
              <pre>{preview || rawText}</pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResumeDashboard;
