const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String, // Resume file name
  uploadedAt: { type: Date, default: Date.now },
  parsedData: Object,
});

module.exports = mongoose.model("Resume", resumeSchema);
