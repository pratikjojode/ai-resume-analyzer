// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = {
  required: async (req, res, next) => {
    try {
      console.log(
        "🔹 Checking Authorization Header:",
        req.header("Authorization")
      );

      // 1. Get token from header
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        console.log("❌ No token found!");
        return res.status(401).json({ error: "User authentication required" });
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token Decoded:", decoded);

      // 3. Find user
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) {
        console.log("❌ User not found!");
        throw new Error("User not found");
      }

      // 4. Attach user and token to request
      req.token = token;
      req.user = user;
      console.log("✅ Authenticated User:", user.email);

      next();
    } catch (error) {
      console.log("❌ Authentication Error:", error.message);
      res.status(401).json({
        error: "Please authenticate",
        details: error.message,
      });
    }
  },
};

module.exports = auth;
