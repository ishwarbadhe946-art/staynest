const mongoose = require("mongoose");

// From practical 01 (registration form)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    mobile: { type: String, required: true, match: /^[6-9][0-9]{9}$/ },
    dob: { type: Date, required: true },
    accountType: { type: String, required: true, enum: ["student", "owner"] },
    password: { type: String, required: true, select: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
