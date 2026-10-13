const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Users live in memory when MongoDB is not configured.
const memoryUsers = [];
const useMongo = () => require("../store").mode() === "mongodb";

const secret = () => process.env.JWT_SECRET || "dev-only-secret-change-me";
const sign = (u) =>
  jwt.sign({ id: String(u._id || u.id), accountType: u.accountType }, secret(), { expiresIn: "7d" });
const publicUser = (u) => ({
  id: String(u._id || u.id),
  username: u.username,
  fullName: u.fullName,
  email: u.email,
  accountType: u.accountType
});

exports.register = async (req, res) => {
  try {
    const { username, fullName, email, mobile, dob, accountType, password } = req.body;

    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, message: "Password needs 8+ characters with letters and numbers" });
    }
    const hash = await bcrypt.hash(password, 10);
    const data = { username, fullName, email, mobile, dob, accountType, password: hash };

    let user;
    if (useMongo()) {
      user = await User.create(data);
    } else {
      const doc = new User(data);
      const err = doc.validateSync();
      if (err) throw err;
      if (memoryUsers.some((u) => u.email === doc.email || u.username === doc.username)) {
        return res.status(409).json({ success: false, message: "Username or email already registered" });
      }
      user = { ...doc.toObject(), id: doc._id.toString() };
      memoryUsers.push(user);
    }

    res.status(201).json({ success: true, message: "Registration successful", token: sign(user), user: publicUser(user) });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ success: false, message: "Username or email already registered" });
    }
    const msg = e.errors ? Object.values(e.errors).map((x) => x.message).join(", ") : e.message;
    res.status(e.name === "ValidationError" ? 400 : 500).json({ success: false, message: msg });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const key = String(email || "").toLowerCase();

    const user = useMongo()
      ? await User.findOne({ email: key }).select("+password")
      : memoryUsers.find((u) => u.email === key);

    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    res.json({ success: true, token: sign(user), user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
