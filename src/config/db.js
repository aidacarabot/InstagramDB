const mongoose = require("mongoose");

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to DB ✅");
    
  } catch (error) {
    console.log("DB exploded! 🤯");
  }
}

module.exports = { connectDB }