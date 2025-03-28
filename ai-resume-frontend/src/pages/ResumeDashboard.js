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

  // Enhanced contact information extraction
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

  // Enhanced projects extraction
  const extractProjects = () => {
    if (!resumeData?.parsedData?.aiAnalysis?.experience?.notable_projects)
      return [];
    return resumeData.parsedData.aiAnalysis.experience.notable_projects.map(
      (project) => ({
        title: project.split(":")[0]?.trim() || project,
        description:
          project.split(":").slice(1).join(":").trim() ||
          "Key project in professional experience",
      })
    );
  };

  if (loading) return <div className="loading">Loading resume analysis...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!resumeData) return <div className="empty">No Resume Found</div>;

  const { filename, uploadedAt, parsedData } = resumeData;
  const { aiAnalysis = {}, rawText = "", preview = "" } = parsedData || {};
  const contactInfo = extractContactInfo(rawText);
  const projects = extractProjects();

  // Deconstruct all necessary fields from aiAnalysis
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
            <div>
              <h2>{contactInfo.name}</h2>
              <div className="contact-info">
                {contactInfo.email && (
                  <div className="contact-item">
                    <FiMail /> {contactInfo.email}
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="contact-item">
                    <FiPhone /> {contactInfo.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="career-level">
              <span
                className={`level-tag ${experience.career_level?.toLowerCase()}`}
              >
                {experience.career_level || "Professional"}
              </span>
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
            <p className="stat-description">
              {resume_quality_score >= 8
                ? "Excellent resume quality"
                : resume_quality_score >= 6
                ? "Good resume with some room for improvement"
                : "Needs significant improvements"}
            </p>
          </div>

          <div className="stat-card">
            <FiBriefcase className="stat-icon" />
            <h4>Experience</h4>
            <p className="experience-years">
              {experience.total_years || "Less than 1"} year
              {experience.total_years !== 1 ? "s" : ""}
            </p>
            <div className="industries">
              {experience.industries?.slice(0, 3).map((industry, i) => (
                <span key={i} className="industry-tag">
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="stat-card">
            <FiAward className="stat-icon" />
            <h4>Job Match</h4>
            {renderMatchPercentage(job_match_percentage)}
            <p className="stat-description">
              {job_match_percentage >= 80
                ? "Strong match for finance roles"
                : job_match_percentage >= 50
                ? "Moderate match - consider tailoring"
                : "Low match - needs optimization"}
            </p>
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
                <FiTool /> Skills
              </h3>
              <div className="skills-columns">
                <div>
                  <h4>Technical Skills</h4>
                  <div className="skills-grid">
                    {skills.technical?.length > 0 ? (
                      skills.technical.map((skill, i) => (
                        <span key={i} className="skill-tag technical">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No technical skills found.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4>Soft Skills</h4>
                  <div className="skills-grid">
                    {skills.soft_skills?.length > 0 ? (
                      skills.soft_skills.map((skill, i) => (
                        <span key={i} className="skill-tag soft">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No soft skills found.</p>
                    )}
                  </div>
                </div>
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
                    <li key={i}>
                      <div className="education-item">
                        <div className="education-degree">
                          {edu.split(",")[0]}
                        </div>
                        <div className="education-institution">
                          {edu.split(",")[1]}
                        </div>
                        <div className="education-duration">
                          {edu.split(",")[2]}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Certifications Section */}
            {certifications.length > 0 && (
              <section className="card certifications-section">
                <h3>
                  <FiAward /> Certifications
                </h3>
                <ul className="certifications-list">
                  {certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
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

                <h4>Actionable Improvements:</h4>
                <ul className="suggestions-list">
                  {actionable_improvements.length > 0 ? (
                    actionable_improvements.map((suggestion, i) => (
                      <li key={i}>
                        <span className="improvement-bullet">•</span>
                        {suggestion}
                      </li>
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
