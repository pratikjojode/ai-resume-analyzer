import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/resumeDashboard.css";

const ResumeDashboard = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(
          `/api/v1/resumes/getResume/${resumeId}`
        );
        setResumeData(response.data.resume);
      } catch (error) {
        setError("Failed to fetch resume data. Please try again later.");
        toast.error("Failed to fetch resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="resume-dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your resume analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-dashboard-container">
        <div className="error-alert">
          <span className="alert-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-dashboard-container">
        <div className="info-alert">
          <span className="alert-icon">ℹ️</span>
          <p>No resume data found</p>
        </div>
      </div>
    );
  }

  const aiAnalysis = resumeData?.parsedData?.aiAnalysis || {};
  const rawText = resumeData?.parsedData?.rawText || "";

  const scoreClass =
    aiAnalysis.resume_quality_score >= 7
      ? "score-high"
      : aiAnalysis.resume_quality_score >= 5
      ? "score-medium"
      : "score-low";

  return (
    <div className="resume-dashboard-container">
      <header className="dashboard-header">
        <h1>Resume Analysis Dashboard</h1>
        <div className="header-decoration"></div>
      </header>

      <div className="file-info-card glow-card">
        <div className="file-header">
          <span className="file-icon">📄</span>
          <h2>{resumeData.filename}</h2>
        </div>
        <p className="upload-time">
          <span className="time-icon">🕒</span>
          Uploaded: {new Date(resumeData.uploadedAt).toLocaleString()}
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="parsed-content-card glow-card">
          <div className="card-header">
            <h3>Parsed Resume Content</h3>
            <span className="content-icon">🔍</span>
          </div>
          <div className="content-wrapper">
            <pre className="parsed-content">{rawText}</pre>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Resume Score */}
          <div className={`score-card glow-card ${scoreClass}-glow`}>
            <div className="card-header">
              <h3>Resume Quality Score</h3>
              <span className="score-icon">⭐</span>
            </div>
            <div className="score-display">
              <div className={`score-badge ${scoreClass}`}>
                {aiAnalysis.resume_quality_score || "N/A"}
                <span className="score-out-of">/10</span>
              </div>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(aiAnalysis.resume_quality_score || 0) * 10}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="score-feedback">
              {aiAnalysis.resume_quality_score >= 7
                ? "Excellent resume!"
                : aiAnalysis.resume_quality_score >= 5
                ? "Good, but could be improved"
                : "Needs significant improvement"}
            </div>
          </div>

          {/* Skills */}
          <div className="skills-card glow-card">
            <div className="card-header">
              <h3>Skills</h3>
              <span className="skills-icon">🛠️</span>
            </div>
            {aiAnalysis.skills?.length > 0 ? (
              <div className="skills-container">
                {aiAnalysis.skills.map((skill, index) => (
                  <span key={index} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="no-data-message">
                <span className="no-data-icon">❓</span>
                No skills data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="experience-card glow-card">
          <div className="card-header">
            <h3>Experience</h3>
            <span className="experience-icon">💼</span>
          </div>
          <div className="experience-summary">
            <p className="total-experience">
              Total Experience:{" "}
              <span className="highlight">
                {aiAnalysis.experience?.total_years || "N/A"} years
              </span>
            </p>
          </div>
          {aiAnalysis.experience?.positions?.length > 0 ? (
            <ul className="positions-list">
              {aiAnalysis.experience.positions.map((position, index) => (
                <li key={index} className="position-item">
                  <span className="bullet">•</span> {position}
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-data-message">
              <span className="no-data-icon">❓</span>
              No experience data available
            </div>
          )}
        </div>

        <div className="education-card glow-card">
          <div className="card-header">
            <h3>Education</h3>
            <span className="education-icon">🎓</span>
          </div>
          {aiAnalysis.education?.length > 0 ? (
            <ul className="education-list">
              {aiAnalysis.education.map((edu, index) => (
                <li key={index} className="education-item">
                  <span className="bullet">•</span> {edu}
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-data-message">
              <span className="no-data-icon">❓</span>
              No education data available
            </div>
          )}
        </div>

        <div className="improvements-card glow-card">
          <div className="card-header">
            <h3>Recommended Improvements</h3>
            <span className="improvements-icon">🔧</span>
          </div>
          {aiAnalysis.missing_keywords?.length > 0 ? (
            <div className="improvements-container">
              {aiAnalysis.missing_keywords.map((keyword, index) => (
                <div key={index} className="improvement-item">
                  <span className="improvement-bullet">✓</span>
                  <span className="improvement-text">{keyword}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="success-message">
              <span className="success-icon">🎉</span>
              No major improvements suggested!
            </div>
          )}
        </div>

        <div className="summary-card glow-card">
          <div className="card-header">
            <h3>AI Analysis Summary</h3>
            <span className="summary-icon">🤖</span>
          </div>
          {aiAnalysis.summary ? (
            <div className="summary-content">
              <p>{aiAnalysis.summary}</p>
            </div>
          ) : (
            <div className="no-data-message">
              <span className="no-data-icon">❓</span>
              No summary available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDashboard;
