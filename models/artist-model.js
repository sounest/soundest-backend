const { Schema, model } = require("mongoose");

const artistSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  coverimage: { type: String, required: true },
  password: { type: String, required: true },
   isartist: {
    type: Boolean,
    default: false,
  },
   status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
});

const Artist = model("artist", artistSchema); // Capitalized name
module.exports = Artist;
