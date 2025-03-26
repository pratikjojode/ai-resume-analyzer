const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const Resume = require("../models/Resume");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_TEXT_LENGTH = 5000; // Reduced text length for better AI processing
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = ["application/pdf"];

// Delay function for retries
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Function to analyze resume using Google Gemini AI
const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `
    Analyze this resume and provide structured JSON output with these fields:
    {
      "skills": [array of top 10 technical skills],
      "experience": {
        "total_years": number,
        "positions": [array of job titles]
      },
      "education": [array of degrees/certifications],
      "missing_keywords": [array of relevant missing keywords],
      "resume_quality_score": number (1-10),
      "job_match_percentage": number (0-100),
      "summary": "brief professional summary"
    }

    Rules:
    - Return ONLY valid JSON
    - No additional commentary
    - Escape special characters properly

    Resume Content:
    ${resumeText.substring(0, MAX_TEXT_LENGTH)}
  `;

  for (let attempt = 0; attempt < 2; attempt++) {
    // Retry mechanism
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { timeout: 20000 } // Increased timeout to 20s
      );

      const aiResponseText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      return JSON.parse(aiResponseText.replace(/```json|```/g, "").trim());
    } catch (error) {
      console.error(
        `AI Analysis Error (Attempt ${attempt + 1}):`,
        error.message
      );
      if (attempt < 1) await delay(5000); // Wait 5 seconds before retrying
    }
  }

  return { error: "AI analysis failed after retries" };
};

// Function to upload and process resume
const uploadResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = path.resolve(req.file.path);

    // Validate file type and size
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      throw new Error("Only PDF files are allowed");
    }

    if (req.file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Read and parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text.substring(0, MAX_TEXT_LENGTH);

    // Create resume record in database
    const newResume = new Resume({
      userId: req.user._id,
      filename: req.file.filename,
      filePath: filePath,
      parsedData: {
        rawText: resumeText.substring(0, 500) + "...",
        length: resumeText.length,
      },
    });

    // AI Analysis
    const aiAnalysis = await analyzeResumeWithAI(resumeText);
    newResume.parsedData.aiAnalysis = {
      ...aiAnalysis,
      analyzedAt: new Date(),
    };

    await newResume.save();

    res.status(201).json({
      success: true,
      resume: newResume.toJSON(),
    });
  } catch (error) {
    console.error("Upload Error:", error.message);

    // Delete the file if an error occurs
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("File cleanup error:", err);
      }
    }

    res.status(500).json({
      error: "Resume processing failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller to get resume by resumeId
const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id; // Extract resume ID from the URL
    const resume = await Resume.findById(resumeId); // Use Mongoose to fetch the resume

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const getResumeByUserId = async (req, res) => {
  const { userId } = req.params;

  console.log("Fetching resumes for userId:", userId); // Log userId for debugging

  try {
    // Fetch all resumes for a specific user
    const resumes = await Resume.find({ userId });
    console.log("Resumes found:", resumes); // Log resumes found

    if (resumes.length === 0) {
      return res.status(404).json({ msg: "No resumes found for this user" });
    }

    return res.json({ success: true, resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error); // Log any errors
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { uploadResume, getResumeById, getResumeByUserId };
