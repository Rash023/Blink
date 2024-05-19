const express = require("express");
const router = express.Router();
const { getBalance, transferFunds } = require("../controllers/bank");
const { bankMiddleWare } = require("../middlewares/bank");

router.get("/balance", bankMiddleWare, getBalance);
router.post("/transfer", bankMiddleWare, transferFunds);

module.exports = router;
