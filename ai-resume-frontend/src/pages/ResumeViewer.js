import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaFilePdf, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import "../styles/ResumeViewer.css";

const ResumeViewer = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-custom flex flex-col items-center py-10">
      <header className="w-full py-6 text-white text-center shadow-lg">
        <h1 className="text-3xl font-bold">Your Resumes</h1>
        <p className="text-gray-300">
          Manage and download your uploaded resumes
        </p>
      </header>

      {loading ? (
        <div className="mt-10 flex flex-col items-center text-gray-700">
          <FaSpinner className="animate-spin text-4xl" />
          <p className="mt-2">Loading resumes...</p>
        </div>
      ) : error ? (
        <div className="mt-10 flex flex-col items-center text-red-600">
          <FaExclamationTriangle className="text-4xl" />
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl px-6 mt-8">
          {resumes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <div key={resume._id} className="card">
                  <div className="card-header">{resume.filename}</div>
                  <div className="card-text">
                    <strong>Uploaded At:</strong>{" "}
                    {new Date(resume.uploadedAt).toLocaleString()}
                  </div>
                  <div className="card-text">
                    <strong>Top Skills:</strong>{" "}
                    {resume.parsedData?.aiAnalysis?.skills?.join(", ") || "N/A"}
                  </div>
                  <div className="card-text">
                    <strong>Experience:</strong>{" "}
                    {resume.parsedData?.aiAnalysis?.experience?.total_years ||
                      "N/A"}{" "}
                    years
                  </div>
                  <div className="card-text">
                    <strong>Resume Score:</strong>{" "}
                    {resume.parsedData?.aiAnalysis?.resume_quality_score ||
                      "N/A"}{" "}
                    / 10
                  </div>
                  <div className="card-footer">
                    <a
                      href={`/uploads/${resume.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FaFilePdf className="mr-2 text-xl" /> View / Download
                      Resume
                    </a>
                  </div>
                </div>
              ))}
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
