const axios = require("axios");
const fs = require("fs").promises; // Async file handling
const path = require("path");
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js"); // OCR for scanned PDFs
const Resume = require("../models/Resume");
const mongoose = require("mongoose");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_TEXT_LENGTH = 5000; // Limit to avoid exceeding AI token limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB size restriction
const ALLOWED_MIME_TYPES = ["application/pdf"];

// Utility function for delay (exponential backoff)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 🔹 AI Resume Analysis using Google Gemini API
 */
const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `
    **🔹 AI Resume Analyzer**
    You are an expert AI specializing in professional resume analysis. Given a resume, provide a structured JSON output with key insights.

    **🔹 Output Format (JSON)**
    {
      "skills": ["Top 10 most relevant skills"],
      "experience": {
        "total_years": "Estimated total years of experience",
        "positions": ["List of job titles"],
        "industries": ["Key industries worked in"]
      },
      "education": ["Degrees, certifications"],
      "leadership_roles": ["Key leadership roles, if any"],
      "missing_keywords": ["Suggested missing keywords to improve resume"],
      "resume_quality_score": "Score (1-10) based on clarity, structure, ATS optimization",
      "job_match_percentage": "Estimated match percentage (0-100%) for relevant job roles",
      "improvement_suggestions": ["Actionable suggestions to enhance resume"],
      "summary": "Brief 2-line professional summary"
    }

    **🔹 Guidelines**
    - Return ONLY a valid JSON response (no additional text, markdown, or explanations).
    - Use NLP to extract meaningful insights from the text.
    - Evaluate resume formatting, keyword optimization, and industry relevance.

    **🔹 Resume Content:**
    ${resumeText.substring(0, MAX_TEXT_LENGTH)}
  `;

  const requestData = { contents: [{ parts: [{ text: prompt }] }] };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        requestData,
        { timeout: 20000 }
      );

      const aiResponseText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      return JSON.parse(aiResponseText.replace(/```json|```/g, "").trim());
    } catch (error) {
      console.error(`AI Analysis Error (Attempt ${attempt}):`, error.message);
      if (attempt < 3) await delay(5000 * attempt); // Exponential backoff (5s, 10s)
    }
  }

  return { error: "AI analysis failed after multiple retries" };
};

/**
 * 🔹 Extract text from PDF (with OCR fallback)
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);

    // If extracted text is too short, try OCR
    if (pdfData.text.trim().length < 50) {
      console.warn("⚠️ PDF text extraction failed, using OCR...");
      const ocrResult = await Tesseract.recognize(filePath);
      return ocrResult.data.text;
    }

    return pdfData.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
};

/**
 * 🔹 Upload and Process Resume
 */
const uploadResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    filePath = path.resolve(req.file.path);

    // Validate file type and size
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype))
      throw new Error("Only PDF files are allowed");
    if (req.file.size > MAX_FILE_SIZE)
      throw new Error("File size exceeds 5MB limit");

    // Extract text from PDF (with OCR fallback)
    let resumeText = await extractTextFromPDF(filePath);
    console.log("✅ Extracted Resume Text:", resumeText.substring(0, 500)); // Debugging log

    // Ensure we only process max text length
    resumeText = resumeText.substring(0, MAX_TEXT_LENGTH);

    // Create a new resume record
    const newResume = new Resume({
      userId: req.user._id,
      filename: req.file.filename,
      filePath,
      parsedData: {
        rawText: resumeText, // Store full text
        preview: resumeText.substring(0, 500) + "...", // Short preview for UI
        length: resumeText.length,
      },
    });

    // AI Analysis
    newResume.parsedData.aiAnalysis = {
      ...(await analyzeResumeWithAI(resumeText)),
      analyzedAt: new Date(),
    };

    await newResume.save();

    res.status(201).json({ success: true, resume: newResume.toJSON() });
  } catch (error) {
    console.error("Upload Error:", error.message);

    // Cleanup: Delete file if error occurs
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
      }
    }

    res.status(500).json({
      error: "Resume processing failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * 🔹 Get Resume by ID
 */
const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, error: "Resume ID is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, error: "Invalid resume ID format" });

    const resume = await Resume.findById(id).lean(); // Use .lean() to improve performance

    if (!resume)
      return res
        .status(404)
        .json({ success: false, error: "Resume not found" });

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error("Error fetching resume:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * 🔹 Get Resumes by User ID
 */
const getResumeByUserId = async (req, res) => {
  const { userId } = req.params;

  console.log("Fetching resumes for userId:", userId); // Debug log

  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid User ID format" });

    const resumes = await Resume.find({ userId }).lean();

    if (!resumes.length)
      return res.status(404).json({ msg: "No resumes found for this user" });

    return res.json({ success: true, resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { uploadResume, getResumeById, getResumeByUserId };
