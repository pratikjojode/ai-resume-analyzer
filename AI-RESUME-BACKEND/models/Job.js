const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  company: { type: String, required: true }, 
  description: { type: String, required: true }, 
  skillsRequired: [String],
  experienceRequired: { type: Number, required: true }, 
  location: { type: String }, 
  postedAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Job", jobSchema);
