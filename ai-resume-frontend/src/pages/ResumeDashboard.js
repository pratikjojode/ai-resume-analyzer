import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiHome,
  FiLogIn,
  FiUser,
  FiFileText,
  FiStar,
  FiTool,
  FiBriefcase,
  FiAward,
  FiBarChart2,
  FiBook,
  FiCode,
  FiLayers,
  FiLink,
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

  // Extract contact information from rawText
  const extractContactInfo = (rawText) => {
    if (!rawText) return {};
    const lines = rawText.split("\n");
    const contactLine = lines[2] || "";
    const portfolioMatch = rawText.match(/Por[^\n]*olio:(.*?)\n/);
    const linkedInMatch = rawText.match(/LinkedIn:(.*?)\n/);
    const githubMatch = rawText.match(/Github:(.*?)\n/);

    return {
      name: lines[2]?.split(",")[0]?.trim() || "Unknown",
      contact: contactLine,
      portfolio: portfolioMatch ? portfolioMatch[1].trim() : null,
      linkedIn: linkedInMatch ? linkedInMatch[1].trim() : null,
      github: githubMatch ? githubMatch[1].trim() : null,
    };
  };

  // Extract projects from rawText
  const extractProjects = (rawText) => {
    if (!rawText) return [];
    const projectsSection = rawText.split("Projects:")[1];
    if (!projectsSection) return [];

    return projectsSection
      .split("\n")
      .filter((line) => line.trim() && line.includes(":"))
      .map((project) => {
        const [title, ...descParts] = project.split(":");
        return {
          title: title.trim(),
          description: descParts.join(":").trim(),
        };
      });
  };

  if (loading) return <div className="loading">Loading resume analysis...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!resumeData) return <div className="empty">No Resume Found</div>;

  const { filename, uploadedAt, parsedData } = resumeData;
  const { aiAnalysis = {}, rawText = "", preview = "" } = parsedData || {};
  const contactInfo = extractContactInfo(rawText);
  const projects = extractProjects(rawText);

  // Deconstruct all necessary fields from aiAnalysis
  const {
    resume_quality_score,
    skills = [],
    experience = {},
    education = [],
    summary,
    job_match_percentage,
    missing_keywords = [],
    improvement_suggestions = [],
    analyzedAt,
  } = aiAnalysis;

  const renderScoreBadge = (score) => {
    let className =
      "score-badge " +
      (score >= 8 ? "excellent" : score >= 6 ? "good" : "poor");
    return (
      <div className={className}>
        <span className="score-value">{score || "N/A"}</span>
        <span className="score-max">/10</span>
      </div>
    );
  };

  const renderMatchPercentage = (percentage) => {
    return (
      <div className="match-percentage">
        <div
          className="match-bar"
          style={{ width: `${percentage || 0}%` }}
        ></div>
        <span>{percentage || 0}%</span>
      </div>
    );
  };

  return (
    <div className="resume-dashboard">
      <header className="dashboard-header">
        <div className="logo" onClick={() => navigate("/")}>
          <FiFileText size={24} />
          <h2>ResumeGenius</h2>
        </div>
        <nav className="nav-links">
          <button onClick={() => navigate("/")}>
            <FiHome /> Home
          </button>
          <button onClick={() => navigate("/profile")}>
            <FiUser /> Profile
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        {/* Candidate Profile Section */}
        <section className="profile-section">
          <div className="profile-header">
            <h2>{contactInfo.name}</h2>

            <div className="social-links">
              {contactInfo.portfolio && (
                <a
                  href={contactInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiLink /> Portfolio
                </a>
              )}
              {contactInfo.linkedIn && (
                <a
                  href={contactInfo.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiLink /> LinkedIn
                </a>
              )}
              {contactInfo.github && (
                <a
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiLink /> GitHub
                </a>
              )}
            </div>
          </div>

          <div className="resume-meta">
            <p>
              <strong>Filename:</strong> {filename.replace(/^[0-9]+-/, "")}
            </p>
            <p>
              <strong>Uploaded:</strong> {new Date(uploadedAt).toLocaleString()}
            </p>
            <p>
              <strong>Analyzed:</strong> {new Date(analyzedAt).toLocaleString()}
            </p>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="overview-section">
          <div className="stat-card">
            <FiStar className="stat-icon" />
            <h4>Resume Score</h4>
            {renderScoreBadge(resume_quality_score)}
          </div>

          <div className="stat-card">
            <FiBriefcase className="stat-icon" />
            <h4>Experience</h4>
            <p>{experience.total_years || "Less than 1 year"}</p>
            {experience.positions?.length > 0 && (
              <div className="positions">
                {experience.positions.map((pos, i) => (
                  <span key={i} className="position-tag">
                    {pos}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="stat-card">
            <FiAward className="stat-icon" />
            <h4>Job Match</h4>
            {renderMatchPercentage(job_match_percentage)}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Summary Section */}
            <section className="card summary-section">
              <h3>
                <FiFileText /> Professional Summary
              </h3>
              <p>{summary || "No summary available."}</p>
            </section>

            {/* Skills Section */}
            <section className="card skills-section">
              <h3>
                <FiTool /> Technical Skills
              </h3>
              <div className="skills-grid">
                {skills.length > 0 ? (
                  skills.map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills found.</p>
                )}
              </div>
            </section>

            {/* Education Section */}
            {education.length > 0 && (
              <section className="card education-section">
                <h3>
                  <FiBook /> Education
                </h3>
                <ul className="education-list">
                  {education.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Projects Section */}
            {projects.length > 0 && (
              <section className="card projects-section">
                <h3>
                  <FiLayers /> Key Projects
                </h3>
                <div className="projects-list">
                  {projects.map((project, i) => (
                    <div key={i} className="project-item">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Improvements Section */}
            <section className="card improvements-section">
              <h3>
                <FiBarChart2 /> Optimization Recommendations
              </h3>
              <div className="recommendations">
                <h4>Missing Keywords:</h4>
                <div className="keywords-grid">
                  {missing_keywords.length > 0 ? (
                    missing_keywords.map((keyword, i) => (
                      <span key={i} className="keyword-tag">
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p>No missing keywords detected.</p>
                  )}
                </div>

                <h4>Improvement Suggestions:</h4>
                <ul className="suggestions-list">
                  {improvement_suggestions.length > 0 ? (
                    improvement_suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))
                  ) : (
                    <p>No suggestions available.</p>
                  )}
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Raw Text Preview */}
        <section className="card raw-text-section">
          <h3>Parsed Resume Content</h3>
          <div className="raw-text-container">
            <pre>{preview || rawText}</pre>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResumeDashboard;
