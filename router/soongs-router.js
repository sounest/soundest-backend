const express = require("express");
const router = express.Router();
const upload = require("../middlewears/upload");
const {
  getAllSongs,
  searchSongs,
  searchLoveSongs,
  rapsongdisplyed,
  addSong,
} = require("../controller/songs-controller");

// ✅ Get All Songs
router.get("/", getAllSongs);

// ✅ Search Songs
router.get("/search", searchSongs);

// ✅ Love Songs
router.get("/love-songs", searchLoveSongs);

// ✅ Rap Songs
router.get("/rapsong", rapsongdisplyed);

// ✅ Upload Song (with file upload)
router.post(
  "/upload",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);

module.exports = router;
