const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" }, 
  matchedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, 
      matchScore: { type: Number }, 
    },
  ],
  extractedSkills: [String], 
  experience: { type: Number }, 
  generatedAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Analysis", analysisSchema);
