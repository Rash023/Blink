const express = require("express");
const {
  searchUser,
  updateUserInfo,
  SignUp,
  login,
  filterUser,
} = require("../controllers/user");
const { authMiddleWare } = require("../middlewares/user");

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", login);
router.get("/search", authMiddleWare, searchUser);
router.post("/updateInfo", authMiddleWare, updateUserInfo);
router.get("/bulk", filterUser);

module.exports = router;
