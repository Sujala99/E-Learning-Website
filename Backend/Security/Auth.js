const jwt = require("jsonwebtoken");
const User = require("../models/userModels")
const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied: No token provided or token format is invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // ✅ Now fetch the full user
    const user = await User.findById(decoded.id || decoded._id).select("name avatar email"); // whatever fields you want
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; // ✅ Attach full user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token or token expired." });
  }
};



// Role-based authorization middleware
exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        // Ensure the user has a valid role before proceeding
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};