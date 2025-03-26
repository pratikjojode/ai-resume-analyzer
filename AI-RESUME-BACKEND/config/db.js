const mongoose = require("mongoose");
require("colors");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing! Check your .env file.");
    }

    console.log(`Connecting to MongoDB...`.yellow);
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`.blue); // ✅ Debugging Line

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB Connected to AI-RESUME-ANALYZER database: ${conn.connection.host}`
        .bgWhite.black
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
