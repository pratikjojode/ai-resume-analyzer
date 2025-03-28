const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const Resume = require("../models/Resume");
const mongoose = require("mongoose");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_TEXT_LENGTH = 10000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf"];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `
    You are an AI specializing in resume analysis and optimization. Analyze the given resume text and return structured JSON insights with professional recommendations.

    ### **Expected JSON Output Format:**
    {
      "skills": {
        "technical": ["Top 10 most relevant technical skills"],
        "soft_skills": ["Key soft skills identified"]
      },
      "experience": {
        "total_years": "Estimated total years of experience",
        "positions": ["List of job titles held"],
        "industries": ["Industries worked in"],
        "notable_projects": ["Highlight major projects"],
        "career_level": "Entry / Mid / Senior / Executive"
      },
      "education": ["Degrees, certifications, notable coursework"],
      "certifications": ["List of certifications and training programs"],
      "leadership_roles": ["Leadership positions and responsibilities"],
      "missing_keywords": ["Suggested keywords for better job discoverability"],
      "resume_quality_score": "Score (1-10) based on clarity, ATS optimization, industry relevance",
      "job_match_percentage": "Estimated suitability (0-100%) for targeted job roles",
      "actionable_improvements": ["Concise recommendations for resume enhancement"],
      "missing_sections": ["List important sections missing (if any)"],
      "summary": "A concise 2-line professional summary highlighting key strengths"
    }

    **Instructions:**
    - Extract details using NLP and structured analysis.
    - Prioritize clarity, ATS compatibility, and keyword optimization.
    - Return ONLY valid JSON (no extra text, markdown, or explanations).

    **Resume Content:**
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
      if (attempt < 3) await delay(5000 * attempt);
    }
  }

  return { error: "AI analysis failed after multiple retries" };
};

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);

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

const uploadResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    filePath = path.resolve(req.file.path);

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype))
      throw new Error("Only PDF files are allowed");
    if (req.file.size > MAX_FILE_SIZE)
      throw new Error("File size exceeds 5MB limit");

    let resumeText = await extractTextFromPDF(filePath);
    console.log("✅ Extracted Resume Text:", resumeText.substring(0, 500));

    resumeText = resumeText.substring(0, MAX_TEXT_LENGTH);

    const newResume = new Resume({
      userId: req.user._id,
      filename: req.file.filename,
      filePath,
      parsedData: {
        rawText: resumeText,
        preview: resumeText.substring(0, 500) + "...",
        length: resumeText.length,
      },
    });

    newResume.parsedData.aiAnalysis = {
      ...(await analyzeResumeWithAI(resumeText)),
      analyzedAt: new Date(),
    };

    await newResume.save();
    res.status(201).json({ success: true, resume: newResume.toJSON() });
  } catch (error) {
    console.error("Upload Error:", error.message);

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

const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID format" });

    const resume = await Resume.findById(id).lean();
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error("Error fetching resume:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getResumeByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid User ID format" });

    const resumes = await Resume.find({ userId }).lean();
    if (!resumes.length)
      return res.status(404).json({ msg: "No resumes found for this user" });

    res.json({ success: true, resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { uploadResume, getResumeById, getResumeByUserId };
