const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: true },
    otpCreatedAt: Date,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

// Removed bcrypt pre-save hook

adminSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("Admin", adminSchema);
