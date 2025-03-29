import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaFilePdf,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import "../styles/ResumeViewer.css";
import { useNavigate } from "react-router-dom";

const ResumeViewer = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded._id;

        const response = await axios.get(
          `/api/v1/resumes/getResumeByUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.success || response.data.resumes.length === 0) {
          throw new Error("No resumes found for this user.");
        }

        setResumes(response.data.resumes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-custom flex flex-col items-center py-10 main">
      <header className="about-header">
        <div className="container">
          <h1 className="logo" onClick={() => navigate("/")}>
            ResumeGenius
          </h1>

          <nav className="nav-links">
            <a href="/about">About</a>
            <a href="/experience">Experience</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="animate-spin text-4xl text-gray-700" />
          <p>Loading resumes...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <FaExclamationTriangle className="text-4xl text-red-600" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl px-6 mt-8">
          {resumes.length > 0 ? (
            <div className="resume-grid">
              {resumes.map((resume) => {
                const { parsedData } = resume || {};
                const aiAnalysis = parsedData?.aiAnalysis || {};

                return (
                  <div key={resume._id} className="card">
                    <div className="card-header">{resume.filename}</div>
                    <div className="card-text">
                      <strong>Uploaded At:</strong>{" "}
                      {new Date(resume.uploadedAt).toLocaleString()}
                    </div>
                    <div className="card-text">
                      <strong>Top Skills:</strong>{" "}
                      {Array.isArray(aiAnalysis.skills)
                        ? aiAnalysis.skills.join(", ")
                        : "N/A"}
                    </div>
                    <div className="card-text">
                      <strong>Experience:</strong>{" "}
                      {aiAnalysis.experience?.total_years ?? "N/A"} years
                    </div>
                    <div className="card-text">
                      <strong>Resume Score:</strong>{" "}
                      {aiAnalysis.resume_quality_score ?? "N/A"} / 10
                    </div>
                    <div className="card-footer">
                      <a
                        href={`/uploads/${resume.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFilePdf className="mr-2 text-xl text-red-500" /> View
                        / Download Resume
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">No resumes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeViewer;
