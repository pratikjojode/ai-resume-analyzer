// routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const {
  uploadResume,
  getResumeById,
  getResumeByUserId,
} = require("../controllers/resumeController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/upload", auth.required, upload.single("resume"), uploadResume);
// Define the route to fetch resume by ID
router.get("/getResume/:id", getResumeById);

router.get("/getResumeByUser/:userId", getResumeByUserId);

module.exports = router;
