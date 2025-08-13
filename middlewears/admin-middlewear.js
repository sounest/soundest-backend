const adminmiddlewear = (req, res, next) => {
  try {
    console.log("Admin Middleware: Current user:", req.user);

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied. User is not an admin" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error in admin middleware" });
  }
};

module.exports = { adminmiddlewear };
