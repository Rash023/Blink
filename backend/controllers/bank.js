const express = require("express");
const jwt = require("jsonwebtoken");
const Bank = require("../model/bank");
const mongoose = require("mongoose");

require("dotenv").config();

//handler to get balance of the user
exports.getBalance = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.userId;

    const account = await Bank.findOne({ userId: id });

    return res.status(200).json({
      succes: true,
      balance: account.balance,
    });
  } catch (error) {
    return res.status(404).json({
      err: error,
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to transfer funds

exports.transferFunds = async (req, res) => {
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;
    const token = req.header("Authorization").replace("Bearer ", "");

    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    let id = decodedToken.userId;
    // Fetch the accounts within the transaction
    const account = await Bank.findOne({ userId: id }).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Bank.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    await Bank.updateOne(
      { userId: id },
      { $inc: { balance: -amount } }
    ).session(session);
    await Bank.updateOne(
      { userId: to },
      { $inc: { balance: +amount } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Transfer successful",
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to get balance of the user
