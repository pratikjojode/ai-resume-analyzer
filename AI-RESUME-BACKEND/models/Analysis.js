const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who owns this analysis
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" }, // Which resume was analyzed
  matchedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Matching job
      matchScore: { type: Number }, // AI match score (0-100%)
    },
  ],
  extractedSkills: [String], // AI-detected skills
  experience: { type: Number }, // AI-detected experience in years
  generatedAt: { type: Date, default: Date.now }, // When analysis was done
});

module.exports = mongoose.model("Analysis", analysisSchema);
