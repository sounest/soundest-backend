const {
  Sendverificationcode,
  welcomeEmail,
  reSendverificationcode,
} = require("../middlewears/Email");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// Register
const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid 10-digit phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationcode = Math.floor(10000 + Math.random() * 90000).toString();

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      verificationcode,
      otpCreatedAt: new Date(),
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    });

    const savedUser = await newUser.save();
    await Sendverificationcode(email, verificationcode);

    const token = savedUser.generateToken();

    res.status(201).json({
      message: "✅ Registration successful. Please verify your email.",
      token,
      userId: savedUser._id.toString(),
      verificationcode,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not found with this email" });
    }

    if (!userExist.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = userExist.generateToken();

    res.status(200).json({
      message: "✅ Login successful",
      token,
      userId: userExist._id.toString(),
      username: userExist.username,
      email: userExist.email,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Home
const home = (req, res) => {
  try {
    res.status(200).send("Welcome to the home page");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Home route error" });
  }
};

// Email Verification
const verifyemail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({ verificationcode: code });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or user" });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.verificationcode = undefined;
    user.otpCreatedAt = undefined;
    user.otpExpiresAt = undefined;

    await user.save();
    await welcomeEmail(user.email, user.username);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const now = new Date();
    if (user.otpCreatedAt && now - user.otpCreatedAt < 5 * 60 * 1000) {
      return res.status(400).json({ message: "Please wait 5 minutes before requesting a new OTP" });
    }

    const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
    user.verificationcode = newOtp;
    user.otpCreatedAt = now;
    user.otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    await user.save();
    await reSendverificationcode(user.email, newOtp);

    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Profile Update
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const originalEmail = user.email;
    const updatedEmail = req.body.email;

    user.username = req.body.username || user.username;
    user.email = updatedEmail || user.email;
    user.pic = req.body.pic || user.pic;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    if (updatedEmail && updatedEmail !== originalEmail) {
      user.isVerified = false;

      const newVerificationCode = Math.floor(10000 + Math.random() * 90000).toString();
      user.verificationcode = newVerificationCode;
      user.otpCreatedAt = new Date();
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await reSendverificationcode(updatedEmail, newVerificationCode);
    }

    const updatedUser = await user.save();
    const token = updatedUser.generateToken();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      pic: updatedUser.pic,
      token,
      message:
        updatedEmail !== originalEmail
          ? "Profile updated. Please verify your new email."
          : "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Forgot Password: Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    user.resetPasswordOtp = otp;
    user.resetOtpCreatedAt = new Date();
    user.resetOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();
    await Sendverificationcode(email, otp);

    res.status(200).json({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.resetPasswordOtp ||
      user.resetPasswordOtp !== otp ||
      !user.resetOtpExpiresAt ||
      user.resetOtpExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetOtpCreatedAt = undefined;
    user.resetOtpExpiresAt = undefined;

    await user.save();
    await welcomeEmail(user.email, user.username);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// ✅ Delete User Account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted from auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};


module.exports = {
  home,
  register,
  login,
  verifyemail,
  resendOtp,
  profile,
  forgotPassword,
  resetPassword,
  deleteAccount
};
