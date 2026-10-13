const mongoose = require("mongoose");

// Returns true when connected to MongoDB, false when running with the
// in-memory store (no MONGO_URI configured).
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠  MONGO_URI not set -> using IN-MEMORY store (data resets on restart).");
    return false;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ MongoDB connected");
  return true;
}

module.exports = connectDB;
