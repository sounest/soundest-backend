const express = require("express");
const router = express.Router();
const { artistregister, login, getAllartist, getSongsByArtist } = require("../controller/artist-controller");
const upload = require("../middlewears/upload");

// ✅ Register Artist with image upload
router.post("/register", (req, res, next) => {
  upload.single("cover")(req, res, function (err) {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size too large. Max 2MB allowed" });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, artistregister);

// ✅ Login Artist
router.post("/login", login);

// ✅ Get All Artists
router.get("/allartist", getAllartist);

// ✅ Get Songs by Artist ID
router.get("/artist/:artistId", getSongsByArtist);

module.exports = router;
