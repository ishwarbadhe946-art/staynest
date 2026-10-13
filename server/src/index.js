const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
require("dotenv").config(); // also allow server/.env

const app = require("./app");
const connectDB = require("./config/db");
const store = require("./store");
const seed = require("./data/seed");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const connected = await connectDB();
    store.use(connected);

    if ((await store.count()) === 0 && process.env.SEED !== "false") {
      for (const h of seed) await store.create(h);
      console.log(`🌱 Seeded ${seed.length} sample hostels`);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🏠 StayNest running on http://localhost:${PORT}  (db: ${store.mode()})`);
    });
  } catch (err) {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  }
})();
