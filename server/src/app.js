const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const hostelRoutes = require("./routes/hostelRoutes");
const authRoutes = require("./routes/authRoutes");
const store = require("./store");

const app = express();

app.use(cors());
app.use(express.json());

// Health + API index (from practicals 06/08/09)
app.get("/api/health", (_req, res) =>
  res.json({ success: true, application: "StayNest", database: store.mode(), uptime: process.uptime() })
);

app.get("/api", (_req, res) =>
  res.json({
    success: true,
    message: "StayNest API",
    endpoints: {
      health: "GET /api/health",
      getAll: "GET /api/hostels",
      getOne: "GET /api/hostels/:id",
      create: "POST /api/hostels",
      update: "PUT /api/hostels/:id",
      delete: "DELETE /api/hostels/:id",
      register: "POST /api/auth/register",
      login: "POST /api/auth/login"
    }
  })
);

app.use("/api/hostels", hostelRoutes);
app.use("/api/auth", authRoutes);

// Unknown API route -> JSON 404
app.use("/api", (_req, res) => res.status(404).json({ success: false, message: "API endpoint not found" }));

// Serve the built React client (single deployable app)
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (_req, res) =>
    res.json({ success: true, message: "StayNest API running. Build the client (npm run build) to serve the UI." })
  );
}

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
