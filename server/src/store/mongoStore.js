const mongoose = require("mongoose");
const Hostel = require("../models/Hostel");

const validId = (id) => mongoose.isValidObjectId(id);

module.exports = {
  async list() {
    return (await Hostel.find().sort({ createdAt: -1 })).map((d) => d.toJSON());
  },
  async get(id) {
    if (!validId(id)) return null;
    const doc = await Hostel.findById(id);
    return doc ? doc.toJSON() : null;
  },
  async create(data) {
    return (await Hostel.create(data)).toJSON();
  },
  async update(id, data) {
    if (!validId(id)) return null;
    const doc = await Hostel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? doc.toJSON() : null;
  },
  async remove(id) {
    if (!validId(id)) return null;
    const doc = await Hostel.findByIdAndDelete(id);
    return doc ? doc.toJSON() : null;
  },
  async count() {
    return Hostel.countDocuments();
  }
};
