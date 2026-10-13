const mongoose = require("mongoose");

// Returns true when connected to MongoDB, false when running with the
// in-memory store (no MONGO_URI configured or connection failed).
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes("<db_password>")) {
    if (uri && uri.includes("<db_password>")) {
      console.warn("⚠  MONGO_URI contains '<db_password>' placeholder. Using IN-MEMORY store.");
    } else {
      console.warn("⚠  MONGO_URI not set -> using IN-MEMORY store (data resets on restart).");
    }
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ MongoDB connected");
    return true;
  } catch (err) {
    console.warn(`⚠  MongoDB connection failed (${err.message}) -> falling back to IN-MEMORY store.`);
    return false;
  }
}

module.exports = connectDB;

