const express = require("express");
const router = express.Router();
const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;
const upload = require("../upload"); // this now exports multer instance

const {
  getAllSongs,
  searchSongs,
  searchLoveSongs,
  rapsongdisplyed,
  addSong,
  bulkInsertSongs,
  searchtrandingSongs
} = require("../controller/songs-controller");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// =================== ROUTES ===================

// Get all songs
router.get("/", getAllSongs);

// Search songs
router.get("/search", searchSongs);

// Get love songs
router.get("/love-songs", searchLoveSongs);

// Get rap songs
router.get("/rapsong", rapsongdisplyed);

// Upload song with cover & audio
router.post(
  "/upload",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      if (!req.files || !req.files.cover || !req.files.audio) {
        return res.status(400).json({ error: "Cover and audio are required" });
      }

      // Upload cover to Cloudinary
      const coverUpload = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        Readable.from(req.files.cover[0].buffer).pipe(stream);
      });

      // Upload audio to Cloudinary
      const audioUpload = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        Readable.from(req.files.audio[0].buffer).pipe(stream);
      });

      // Wait for both uploads
      const [coverResult, audioResult] = await Promise.all([
        coverUpload,
        audioUpload
      ]);

      // Attach URLs to body
      req.body.coverUrl = coverResult.secure_url;
      req.body.audioUrl = audioResult.secure_url;

      // Save to DB
      return addSong(req, res, next);
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Trending songs
router.get("/trend-songs", searchtrandingSongs);

// Bulk insert songs
router.post("/bulk-insert", bulkInsertSongs);

module.exports = router;
