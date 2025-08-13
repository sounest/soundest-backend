const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }, // stored as hashed
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    verificationcode: String,
    otpCreatedAt: Date,
    otpExpiresAt: Date,

    // ✅ Forgot Password Fields
    resetPasswordOtp: String,
    resetOtpCreatedAt: Date,
    resetOtpExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("User", userSchema);
