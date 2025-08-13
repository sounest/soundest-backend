const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewears/error-middlewear");

const app = express();

// ✅ Debug Mongo URI
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);

// ✅ Check ENV before connecting
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}

// ✅ CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
}));
app.use(express.json()); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Serve React Build
// const frontendPath = path.join(__dirname, "../Frontend/dist");
// app.use(express.static(frontendPath));

// ✅ API Routes
app.use("/api/auth", require("./router/auth-router"));
app.use("/api/contact", require("./router/contact-router"));
app.use("/api/artist", require("./router/artist-router"));
app.use("/api/songs", require("./router/songs-router"));
app.use("/api/admin", require("./router/admin-router"));

// ✅ React Fallback for SPA
// app.get("*", (_, res) => {
//   res.sendFile(path.resolve(frontendPath, "index.html"));
// });

// ✅ Error Middleware
app.use(errorMiddleware);

// ✅ Start Server
const PORT =  5000;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));




