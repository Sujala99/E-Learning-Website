const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied: No token provided or token format is invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 👇 Select all fields needed in controllers
    const user = await User.findById(decoded.id || decoded._id).select("name avatar email role _id");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // 👇 Attach full user data
    req.user = {
      id: user._id.toString(), // make sure it's a string
      username: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token or token expired." });
  }
};


exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
};
