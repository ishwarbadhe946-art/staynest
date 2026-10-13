const mongoose = require("mongoose");

// Unified schema merging practicals 05/06 (hostelType, email, availableRooms,
// description) and 09 (type PG/Hostel, availability) + the UI needs of 03/04.
const hostelSchema = new mongoose.Schema(
  {
    hostelName: { type: String, required: [true, "Hostel name is required"], trim: true },
    ownerName: { type: String, required: [true, "Owner name is required"], trim: true },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^[6-9][0-9]{9}$/, "Contact must be a valid 10-digit Indian mobile number"]
    },
    email: { type: String, trim: true, lowercase: true, default: "" },
    location: { type: String, required: [true, "Location is required"], trim: true },

    type: { type: String, enum: ["PG", "Hostel"], default: "PG" },
    hostelType: { type: String, enum: ["Boys", "Girls", "Co-ed"], default: "Co-ed" },
    roomType: {
      type: String,
      enum: ["Single", "Double Sharing", "Triple Sharing"],
      default: "Double Sharing"
    },

    rent: { type: Number, required: [true, "Rent is required"], min: [500, "Rent must be at least 500"] },
    availableRooms: { type: Number, default: 1, min: 0 },
    facilities: { type: [String], default: [] },
    description: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 4.5 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = String(ret._id);
        delete ret.__v;
        return ret;
      }
    }
  }
);

// availability is derived from availableRooms (replaces the stored field in 09)
hostelSchema.virtual("availability").get(function () {
  return this.availableRooms > 0 ? "Available" : "Full";
});

module.exports = mongoose.models.Hostel || mongoose.model("Hostel", hostelSchema);
