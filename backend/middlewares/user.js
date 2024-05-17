const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleWare = (req, res, next) => {
  const authHeader = req.header.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({
      success: false,
      message: "Internal Server error",
    });
  }

  const token = authHeader.replace("Bearer", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    }
  } catch {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleWare;
