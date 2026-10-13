const store = require("../store");

// Never let clients overwrite server-managed fields
const clean = (body = {}) => {
  const { _id, id, __v, createdAt, updatedAt, availability, ...fields } = body;
  return fields;
};

const isValidation = (e) => e && (e.name === "ValidationError" || e.name === "CastError");

const messageOf = (e) =>
  e.errors ? Object.values(e.errors).map((x) => x.message).join(", ") : e.message;

exports.getAllHostels = async (_req, res) => {
  try {
    const hostels = await store.list();
    res.json({ success: true, count: hostels.length, hostels });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getHostelById = async (req, res) => {
  try {
    const hostel = await store.get(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    res.json({ success: true, hostel });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid hostel ID" });
  }
};

exports.createHostel = async (req, res) => {
  try {
    const hostel = await store.create(clean(req.body));
    res.status(201).json({ success: true, message: "Hostel added successfully", hostel });
  } catch (e) {
    res.status(isValidation(e) ? 400 : 500).json({ success: false, message: messageOf(e) });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await store.update(req.params.id, clean(req.body));
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    res.json({ success: true, message: "Hostel updated successfully", hostel });
  } catch (e) {
    res.status(isValidation(e) ? 400 : 500).json({ success: false, message: messageOf(e) });
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await store.remove(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    res.json({ success: true, message: "Hostel deleted successfully", hostel });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid hostel ID" });
  }
};
