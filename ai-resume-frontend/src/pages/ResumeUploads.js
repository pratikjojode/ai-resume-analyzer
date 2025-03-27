import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiHome,
  FiUser,
  FiLogIn,
} from "react-icons/fi";
import { Layout, Typography, Space, Button } from "antd";
import "../styles/ResumeUpload.css";
import Footer from "../components/Footer";

const { Header } = Layout;
const { Title } = Typography;

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && /\.(pdf|doc|docx)$/i.test(uploadedFile.name)) {
      setFile(uploadedFile);
    } else {
      toast.error("Please upload a PDF, DOC, or DOCX file");
    }
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
    <Layout className="upload-layout">
      <Header className="upload-header-nav">
        <div className="header-content">
          <Title level={3} className="logo">
            ResumeGenius
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

      <div className="upload-page">
        <div className="upload-container">
          <div className="upload-header">
            <h1>Enhance Your Resume</h1>
            <p className="upload-subtitle">
              Upload your resume for AI-powered analysis and optimization
            </p>
          </div>

          <div
            className={`upload-area ${isDragging ? "dragging" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <FiUpload size={48} />
            </div>
            <h3>Drag & Drop your resume here</h3>
            <p className="upload-hint">or click to browse files</p>

            <input
              type="file"
              id="resume-upload"
              className="file-input"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <label htmlFor="resume-upload" className="browse-button">
              Browse Files
            </label>

            {file && (
              <div className="file-preview">
                <FiFile className="file-icon" />
                <span className="file-name">{file.name}</span>
                <FiCheckCircle className="check-icon" />
              </div>
            )}
          </div>

          <div className="supported-formats">
            <span>Supported formats: PDF, DOC, DOCX</span>
            <span>Max file size: 5MB</span>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`upload-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <span className="button-loading">Analyzing Resume...</span>
            ) : (
              <>
                <FiUpload className="button-icon" />
                <span>Analyze My Resume</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeUpload;
