const express = require("express");
const router = express.Router();
const upload = require("../middlewears/upload");
const {
  getAllSongs,
  searchSongs,
  searchLoveSongs,
  rapsongdisplyed,
  addSong,
  bulkInsertSongs,
  searchtrandingSongs
} = require("../controller/songs-controller");

router.get("/", getAllSongs);
router.get("/search", searchSongs);
router.get("/love-songs", searchLoveSongs);
router.get("/rapsong", rapsongdisplyed);

// ✅ Upload song with cover & audio
router.post(
  "/upload",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);

router.get("/trend-songs", searchtrandingSongs);

// ✅ Bulk insert songs
router.post("/bulk-insert", bulkInsertSongs);

module.exports = router;
