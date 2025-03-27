const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = await user.generateAuthToken();

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});


module.exports = router;
const jwt = require("jsonwebtoken");
