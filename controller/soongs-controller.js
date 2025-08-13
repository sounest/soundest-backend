const Song = require("../models/song-model");

// ✅ Get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch songs", error: err.message });
  }
};

// ✅ Get song by ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ msg: "Song not found" });
    res.status(200).json(song);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch song", error: err.message });
  }
};

// ✅ Add new song (with file upload)
const addSong = async (req, res) => {
  try {
    const { title, cat, description, artist } = req.body;

    // ✅ File URLs for public access
    const coverPath = req.files?.cover
      ? `/images/${req.files.cover[0].filename}`
      : "";
    const audioPath = req.files?.audio
      ? `/songs/${req.files.audio[0].filename}`
      : "";

    if (!title || !cat || !audioPath || !artist) {
      return res
        .status(400)
        .json({ msg: "Title, category, artist and audio file are required" });
    }

    const newSong = new Song({
      title,
      artist,
      genre: cat,
      image: coverPath,
      audio: audioPath,
      description: description || "",
    });

    await newSong.save();

    res.status(201).json({
      msg: "Song uploaded successfully",
      song: newSong,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to upload song", error: err.message });
  }
};

// ✅ Update song
const updateSong = async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSong)
      return res.status(404).json({ msg: "Song not found" });
    res
      .status(200)
      .json({ msg: "Song updated successfully", song: updatedSong });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update song", error: err.message });
  }
};

// ✅ Delete song
const deleteSong = async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong)
      return res.status(404).json({ msg: "Song not found" });
    res.status(200).json({ msg: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete song", error: err.message });
  }
};

// ✅ Search songs by title, artist, genre, or description
const searchSongs = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query)
      return res.status(400).json({ msg: "Search query is required" });

    const results = await Song.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to search songs", error: err.message });
  }
};

// ✅ Get only Love Songs (by genre)
const searchLoveSongs = async (req, res) => {
  try {
    const results = await Song.find({
      genre: { $regex: "love song", $options: "i" },
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No love songs found" });
    }

    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch love songs", error: err.message });
  }
};

// ✅ Get Rap Songs
const rapsongdisplyed = async (req, res) => {
  try {
    const results = await Song.find({
      genre: { $regex: "rap song", $options: "i" },
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No rap songs found" });
    }

    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch rap songs", error: err.message });
  }
};

// ✅ Bulk Insert Songs
const bulkInsertSongs = async (req, res) => {
  try {
    let songs = req.body; // Expecting an array of song objects

    if (!Array.isArray(songs)) {
      return res.status(400).json({ error: "Request body must be an array of songs" });
    }

    // Remove _id if present to avoid duplicate key error
    songs = songs.map(({ _id, ...rest }) => rest);

    // Insert songs in bulk
    const insertedSongs = await Song.insertMany(songs, { ordered: false });

    res.status(201).json({
      msg: `${insertedSongs.length} songs inserted successfully`,
      data: insertedSongs,
    });
  } catch (error) {
    console.error("Bulk Insert Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong,
  searchSongs,
  searchLoveSongs,
  rapsongdisplyed,
  bulkInsertSongs
};
