const express = require("express");
const { searchUser, updateUserInfo } = require("../controllers/user");
const router = express.Router();

router.post("/SignUp", SignUp);
router.get("/search", searchUser);
router.post("/updateInfo", updateUserInfo);

module.exports = router;
