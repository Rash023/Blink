const express = require("express");
const router = express.Router();
const getBalance = require("../controllers/bank");

router.get("balance", getBalance);

module.exports = router;
