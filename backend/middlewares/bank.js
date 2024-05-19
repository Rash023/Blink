const Bank = require("../model/bank");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.bankMiddleWare = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.header.authorization.replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const id = decodedToken.userId;

    const user = await Bank.findOne({ userId: id });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch {
    return res.status(404).json({
      success: false,
      message: "Internal server error",
    });
  }
};
