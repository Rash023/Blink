const express = require("express");
const {
  searchUser,
  updateUserInfo,
  SignUp,
  login,
} = require("../controllers/user");
const { authMiddleWare } = require("../middlewares/user");

const router = express.Router();

router.post("/signUp", SignUp);
router.post("/login", login);
router.get("/search", authMiddleWare, searchUser);
router.post("/updateInfo", authMiddleWare, updateUserInfo);

module.exports = router;
