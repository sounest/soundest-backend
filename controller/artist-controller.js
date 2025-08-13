const Artist = require("../models/artist-model");
const Song = require("../models/song-model"); // ✅ Required for songs fetching
const bcrypt = require("bcryptjs");

// ✅ Artist Registration
const artistregister = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const artistExist = await Artist.findOne({ email });
    if (artistExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Get uploaded file path
    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

    const artistData = {
      username,
      email,
      mobile: phone,
      coverimage: coverPath,
      password: hashedPassword,
      status: "pending", // Default status
      isartist: true
    };

    await Artist.create(artistData);

    return res.status(200).json({ message: "Artist registered successfully. Please wait for admin approval." });
  } catch (error) {
    console.error("Artist Registration Error:", error);
    return res.status(500).json({ message: "Failed to register artist" });
  }
};

// ✅ Artist Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const artist = await Artist.findOne({ email });
    if (!artist) {
      return res.status(400).json({ message: "Artist not found with this email" });
    }

    // ✅ Check approval status
    if (artist.status !== "approved") {
      return res.status(403).json({ message: "Your account is not approved yet. Please wait for admin approval." });
    }

    const isPasswordValid = await bcrypt.compare(password, artist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login successful",
      artist: {
        id: artist._id,
        username: artist.username,
        email: artist.email,
        coverimage: artist.coverimage ? `http://localhost:5000${artist.coverimage}` : null,
        isartist: artist.isartist,
      },
    });
  } catch (error) {
    console.error("Artist Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Artists
const getAllartist = async (req, res) => {
  try {
    const artists = await Artist.find().select("-password"); // Exclude password
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch artists", error: err.message });
  }
};


// ✅ Get Songs by Artist
const getSongsByArtist = async (req, res) => {
  try {
    const songs = await Song.find({ artistId: req.params.artistId }).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { artistregister, login, getAllartist, getSongsByArtist };
