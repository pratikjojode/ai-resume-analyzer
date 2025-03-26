import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/ResumeUpload.css";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Resume uploaded successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate(`/resume/${response.data.resume._id}`);
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

      <div className="file-input-wrapper">
        <label className="file-input-label">
          <span>Choose File (PDF/DOC/DOCX)</span>
          {file ? (
            <span className="file-name">{file.name}</span>
          ) : (
            <span className="file-name">No file selected</span>
          )}
          <input
            type="file"
            className="file-input"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="upload-button"
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
