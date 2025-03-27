import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/resumeDashboard.css";
import { Layout, Typography, Space, Button } from "antd";
import { FiHome, FiLogIn, FiUser } from "react-icons/fi";

const ResumeDashboard = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { Header } = Layout;
  const { Title } = Typography;
  const navigate = useNavigate();

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
      <div className="resume-dashboard-container dark-theme">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your resume analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-dashboard-container dark-theme">
        <div className="error-alert">
          <span className="alert-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-dashboard-container dark-theme">
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
    <div className="resume-dashboard-container dark-theme">
      {/* Premium Header - Dark Theme */}
      <Header className="upload-header-nav">
        <div className="header-content">
          <Title level={3} className="logo">
            <span>Resume</span>Genius
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

      {/* Dashboard Title */}
      <div className="dashboard-title-container dark-title">
        <h1 className="dashboard-title">
          <span className="title-icon">📝</span> Resume Analysis Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Comprehensive insights to optimize your resume for better
          opportunities
        </p>
      </div>

      {/* File Info Card */}
      <div className="file-info-card premium-card dark-card">
        <div className="file-header">
          <div className="file-icon-container">
            <span className="file-icon">📄</span>
            <div className="file-icon-bg dark-icon-bg"></div>
          </div>
          <div className="file-info">
            <h2>{resumeData.filename}</h2>
            <p className="upload-time">
              <span className="time-icon">🕒</span>
              Uploaded: {new Date(resumeData.uploadedAt).toLocaleString()}
            </p>
          </div>
          <button className="download-btn dark-download">
            <span className="download-icon">⬇️</span> Download Report
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="parsed-content-card premium-card dark-card">
          <div className="card-header dark-card-header">
            <h3>
              <span className="header-icon">🔍</span> Parsed Resume Content
            </h3>
            <div className="card-actions">
              <button className="card-action-btn dark-action">
                <span className="action-icon">🔎</span> Search
              </button>
              <button className="card-action-btn dark-action">
                <span className="action-icon">📋</span> Copy
              </button>
            </div>
          </div>
          <div className="content-wrapper dark-content">
            <pre className="parsed-content dark-parsed">{rawText}</pre>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Resume Score */}
          <div
            className={`score-card premium-card dark-card ${scoreClass}-glow`}
          >
            <div className="card-header dark-card-header">
              <h3>
                <span className="header-icon">⭐</span> Resume Quality Score
              </h3>
              <div
                className="score-tooltip dark-tooltip"
                title="Based on industry standards"
              >
                <span className="tooltip-icon">ℹ️</span>
              </div>
            </div>
            <div className="score-display">
              <div className={`score-badge ${scoreClass}`}>
                {aiAnalysis.resume_quality_score || "N/A"}
                <span className="score-out-of">/10</span>
              </div>
              <div className="progress-container dark-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(aiAnalysis.resume_quality_score || 0) * 10}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="score-feedback dark-feedback">
              {aiAnalysis.resume_quality_score >= 7
                ? "Excellent resume! Strong alignment with top industry standards."
                : aiAnalysis.resume_quality_score >= 5
                ? "Good foundation, but has room for strategic improvements."
                : "Needs significant improvement to be competitive."}
            </div>
            <div className="score-comparison dark-comparison">
              <div className="comparison-item">
                <span className="comparison-label">Industry Avg:</span>
                <span className="comparison-value">6.2</span>
              </div>
              <div className="comparison-item">
                <span className="comparison-label">Top 10%:</span>
                <span className="comparison-value">8.5+</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="skills-card premium-card dark-card">
            <div className="card-header dark-card-header">
              <h3>
                <span className="header-icon">🛠️</span> Skills Analysis
              </h3>
              <div className="skills-count dark-count">
                {aiAnalysis.skills?.length || 0} skills detected
              </div>
            </div>
            {aiAnalysis.skills?.length > 0 ? (
              <>
                <div className="skills-container dark-skills">
                  {aiAnalysis.skills.map((skill, index) => (
                    <span key={index} className="skill-chip dark-chip">
                      {skill}
                      <span className="skill-demand dark-demand">+12%</span>
                    </span>
                  ))}
                </div>
                <div className="skills-insight dark-insight">
                  <span className="insight-icon">💡</span>
                  <p>
                    Your skills match <strong>78%</strong> of top-performing
                    resumes in your field.
                  </p>
                </div>
              </>
            ) : (
              <div className="no-data-message dark-message">
                <span className="no-data-icon">❓</span>
                No skills data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="experience-card premium-card dark-card">
          <div className="card-header dark-card-header">
            <h3>
              <span className="header-icon">💼</span> Experience Analysis
            </h3>
            <div className="card-badge dark-badge">Key Metric</div>
          </div>
          <div className="experience-summary dark-summary">
            <div className="experience-metric">
              <p className="metric-label dark-label">Total Experience</p>
              <p className="metric-value dark-value">
                {aiAnalysis.experience?.total_years || "N/A"} years
              </p>
            </div>
            <div className="experience-metric">
              <p className="metric-label dark-label">Seniority Level</p>
              <p className="metric-value dark-value">Mid-Career</p>
            </div>
          </div>
          {aiAnalysis.experience?.positions?.length > 0 ? (
            <>
              <h4 className="section-subtitle dark-subtitle">
                Position Highlights
              </h4>
              <ul className="positions-list dark-list">
                {aiAnalysis.experience.positions.map((position, index) => (
                  <li key={index} className="position-item dark-item">
                    <span className="bullet">•</span> {position}
                  </li>
                ))}
              </ul>
              <div className="experience-chart dark-chart">
                <div className="chart-placeholder"></div>
                <p className="chart-caption dark-caption">
                  Experience distribution compared to industry benchmarks
                </p>
              </div>
            </>
          ) : (
            <div className="no-data-message dark-message">
              <span className="no-data-icon">❓</span>
              No experience data available
            </div>
          )}
        </div>

        <div className="education-card premium-card dark-card">
          <div className="card-header dark-card-header">
            <h3>
              <span className="header-icon">🎓</span> Education Analysis
            </h3>
            <div className="card-badge dark-badge">Verified</div>
          </div>
          {aiAnalysis.education?.length > 0 ? (
            <>
              <ul className="education-list dark-list">
                {aiAnalysis.education.map((edu, index) => (
                  <li key={index} className="education-item dark-item">
                    <span className="bullet">•</span> {edu}
                  </li>
                ))}
              </ul>
              <div className="education-impact dark-impact">
                <span className="impact-icon">📈</span>
                <p>
                  Your education background increases interview chances by{" "}
                  <strong>22%</strong> for relevant positions.
                </p>
              </div>
            </>
          ) : (
            <div className="no-data-message dark-message">
              <span className="no-data-icon">❓</span>
              No education data available
            </div>
          )}
        </div>

        <div className="improvements-card premium-card dark-card">
          <div className="card-header dark-card-header">
            <h3>
              <span className="header-icon">🔧</span> Optimization
              Recommendations
            </h3>
            <div className="card-badge accent dark-accent">Priority</div>
          </div>
          {aiAnalysis.missing_keywords?.length > 0 ? (
            <>
              <div className="improvements-container dark-improvements">
                {aiAnalysis.missing_keywords
                  .slice(0, 5)
                  .map((keyword, index) => (
                    <div key={index} className="improvement-item dark-item">
                      <span className="improvement-priority">
                        {index < 2 ? "❗" : "✓"}
                      </span>
                      <div className="improvement-content">
                        <p className="improvement-text dark-text">
                          Add <strong>{keyword}</strong>
                        </p>
                        <p className="improvement-detail dark-detail">
                          Found in 82% of top resumes | +15% impact
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <button className="see-all-btn dark-see-all">
                See all {aiAnalysis.missing_keywords.length} recommendations →
              </button>
            </>
          ) : (
            <div className="success-message dark-success">
              <span className="success-icon">🎉</span>
              <p>
                No major improvements suggested! Your resume is well-optimized.
              </p>
            </div>
          )}
        </div>

        <div className="summary-card premium-card dark-card">
          <div className="card-header dark-card-header">
            <h3>
              <span className="header-icon">🤖</span> AI Analysis Summary
            </h3>
            <div className="card-actions">
              <button className="card-action-btn dark-action">
                <span className="action-icon">🔊</span> Read Aloud
              </button>
            </div>
          </div>
          {aiAnalysis.summary ? (
            <div className="summary-content dark-summary-content">
              <p>{aiAnalysis.summary}</p>
              <div className="summary-metrics dark-metrics">
                <div className="metric dark-metric">
                  <span className="metric-value dark-value">87%</span>
                  <span className="metric-label dark-label">
                    ATS Compatibility
                  </span>
                </div>
                <div className="metric dark-metric">
                  <span className="metric-value dark-value">4.2/5</span>
                  <span className="metric-label dark-label">Readability</span>
                </div>
                <div className="metric dark-metric">
                  <span className="metric-value dark-value">92%</span>
                  <span className="metric-label dark-label">Completion</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data-message dark-message">
              <span className="no-data-icon">❓</span>
              No summary available
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="premium-footer dark-footer">
        <p>ResumePro Analytics Dashboard • {new Date().getFullYear()}</p>
        <div className="footer-links dark-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default ResumeDashboard;
