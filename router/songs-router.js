const express = require("express");
const router = express.Router();
const { Readable } = require("stream");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const {
  getAllSongs,
  searchSongs,
  searchLoveSongs,
  rapsongdisplyed,
  addSong,
  bulkInsertSongs,
  searchtrandingSongs
} = require("../controller/songs-controller");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Multer memory storage (no local disk saving)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =================== ROUTES ===================

// Get all songs
router.get("/", getAllSongs);

// Search songs
router.get("/search", searchSongs);

// Get love songs
router.get("/love-songs", searchLoveSongs);

// Get rap songs
router.get("/rapsong", rapsongdisplyed);

// ✅ Upload song with cover & audio (Cloudinary)
router.post(
  "/upload",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      if (!req.files || !req.files.cover || !req.files.audio) {
        return res.status(400).json({ error: "Cover and audio are required" });
      }

      // Upload cover to Cloudinary
      const coverStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, coverResult) => {
          if (error) return res.status(500).json({ error: error.message });

          // Upload audio to Cloudinary
          const audioStream = cloudinary.uploader.upload_stream(
            { resource_type: "video" },
            async (error, audioResult) => {
              if (error) return res.status(500).json({ error: error.message });

              // Attach Cloudinary URLs to req.body
              req.body.coverUrl = coverResult.secure_url;
              req.body.audioUrl = audioResult.secure_url;

              // Call your existing controller
              return addSong(req, res, next);
            }
          );

          // Pipe audio buffer to Cloudinary
          Readable.from(req.files.audio[0].buffer).pipe(audioStream);
        }
      );

      // Pipe cover buffer to Cloudinary
      Readable.from(req.files.cover[0].buffer).pipe(coverStream);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Trending songs
router.get("/trend-songs", searchtrandingSongs);

// Bulk insert songs
router.post("/bulk-insert", bulkInsertSongs);

module.exports = router;
