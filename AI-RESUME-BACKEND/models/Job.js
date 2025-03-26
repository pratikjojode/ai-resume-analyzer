const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Job title (e.g., Software Engineer)
  company: { type: String, required: true }, // Company name
  description: { type: String, required: true }, // Full job description
  skillsRequired: [String], // List of required skills
  experienceRequired: { type: Number, required: true }, // Required years of experience
  location: { type: String }, // Job location (optional)
  postedAt: { type: Date, default: Date.now }, // When the job was posted
});

module.exports = mongoose.model("Job", jobSchema);
