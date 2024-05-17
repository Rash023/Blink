const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Bank", BankSchema);
