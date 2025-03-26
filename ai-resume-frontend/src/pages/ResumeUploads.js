import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import the toast component
import { useNavigate } from "react-router-dom";
import styles from "../styles/ResumeUpload.css";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // Handle resume upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const response = await axios.post("/api/v1/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token if needed for authentication
        },
      });

      toast.success("Resume uploaded successfully!");

      // Extract resumeId from the response
      const resumeId = response.data.resume._id;

      // Navigate to the resume dashboard with the resumeId
      navigate(`/resume/${resumeId}`);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "An error occurred while uploading"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Resume</h2>
      <div className="input-container">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`upload-button ${loading ? "loading" : ""}`}
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
