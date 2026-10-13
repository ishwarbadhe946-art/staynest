const crypto = require("crypto");
const Hostel = require("../models/Hostel");

// In-memory store (idea from practical 08). Uses the Mongoose model purely for
// validation/defaults so behaviour matches the MongoDB store.
let items = [];

const build = (data, existing = {}) => {
  const doc = new Hostel({ ...existing, ...data });
  const err = doc.validateSync();
  if (err) throw err;
  return doc;
};

const serialize = (doc, id, createdAt, updatedAt) => {
  const json = doc.toJSON();
  json.id = id;
  json._id = id;
  json.createdAt = createdAt;
  json.updatedAt = updatedAt;
  return json;
};

const plain = (item) => {
  const { id, _id, createdAt, updatedAt, availability, ...fields } = item;
  return fields;
};

module.exports = {
  async list() {
    return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async get(id) {
    return items.find((h) => h.id === id) || null;
  },
  async create(data) {
    const now = new Date().toISOString();
    const item = serialize(build(data), crypto.randomUUID(), now, now);
    items.push(item);
    return item;
  },
  async update(id, data) {
    const idx = items.findIndex((h) => h.id === id);
    if (idx === -1) return null;
    const old = items[idx];
    const updated = serialize(build(data, plain(old)), id, old.createdAt, new Date().toISOString());
    items[idx] = updated;
    return updated;
  },
  async remove(id) {
    const idx = items.findIndex((h) => h.id === id);
    if (idx === -1) return null;
    return items.splice(idx, 1)[0];
  },
  async count() {
    return items.length;
  }
};
