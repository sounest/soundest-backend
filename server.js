const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewears/error-middlewear");
const serverless = require("serverless-http");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", require("./router/auth-router"));
app.use("/api/contact", require("./router/contact-router"));
app.use("/api/artist", require("./router/artist-router"));
app.use("/api/songs", require("./router/songs-router"));
app.use("/api/admin", require("./router/admin-router"));

// ✅ Error handler
app.use(errorMiddleware);

// ✅ DB connection
connectDb().catch(err => console.error("❌ MongoDB connection failed:", err));

module.exports = app;
module.exports.handler = serverless(app);
