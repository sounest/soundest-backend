const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const Admin = require("../models/admin-model");

const protect = async (req, res, next) => {
  const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Check if User exists
    let user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      // ✅ If not user, check if Admin exists
      user = await Admin.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User or Admin not found" });
      }

      // ✅ Explicitly mark as admin for role checks
      user.isAdmin = true;
    }

    // ✅ Attach user (or admin) to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
}

module.exports = { protect };
