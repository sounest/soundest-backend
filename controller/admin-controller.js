const User = require("../models/user-model");
const Contacts = require("../models/contact-model");
const Artist = require("../models/artist-model");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin-model");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { password: 0 });
  if (!users.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
};

const getAllContacts = async (req, res) => {
  const contacts = await Contacts.find();
  if (!contacts.length) {
    return res.status(404).json({ message: "No contacts found" });
  }
  res.status(200).json(contacts);
};

const getAllArtists = async (req, res) => {
  const artists = await Artist.find({}, { password: 0 });
  if (!artists.length) {
    return res.status(404).json({ message: "No artists found" });
  }
  res.status(200).json(artists);
};

const deleteOneuser = async (req, res) => {
  const { id } = req.params;
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User deleted successfully" });
};

const deleteOneartists = async (req, res) => {
  const { id1 } = req.params;
  const result = await Artist.findByIdAndDelete(id1);
  if (!result) {
    return res.status(404).json({ message: "Artist not found" });
  }
  res.status(200).json({ message: "Artist deleted successfully" });
};

const deleteOneAllcontact = async (req, res) => {
  const result = await Contacts.deleteMany({});
  res.status(200).json({ message: "All contacts deleted", result });
};

const approveartists = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Artist.findByIdAndUpdate(
      id,
      { status: "approved", isartist: true }, // ✅ set status and isartist true
      { new: true } // ✅ return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({ message: "Artist approved", artist: updated });
  } catch (error) {
    console.error("Error approving artist:", error);
    res.status(500).json({ message: "Server error while approving artist" });
  }
};


const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  const adminExist = await Admin.findOne({ email });
  if (adminExist) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({
    username,
    email,
    password: hashedPassword,
    isVerified: true,
  });

  const savedAdmin = await newAdmin.save();

  const token = savedAdmin.generateToken();

  res.status(201).json({
    message: "✅ Registration successful.",
    token,
    admin: {
      username: savedAdmin.username,
      email: savedAdmin.email,
    },
  });
};

const postlogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = admin.generateToken();

  res.status(200).json({
    message: "✅ Login successful",
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    },
  });
};

module.exports = {
  getAllUsers,
  getAllContacts,
  getAllArtists,
  deleteOneuser,
  deleteOneAllcontact,
  deleteOneartists,
  approveartists,
  postlogin,
  register,
};
