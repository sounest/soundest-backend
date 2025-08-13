const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String }, // Later link to logged-in artist
    genre: String,
    image: String, // Cover image path
    audio: String, // Audio file path
    description: String,
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
