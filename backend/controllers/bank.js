const express = require("express");
const jwt = require("jsonwebtoken");
const Bank = require("../model/bank");
const mongoose = require("mongoose");

require("dotenv").config();

//handler to get balance of the user
export const getBalance = async (req, res) => {
  try {
    const token = req.header.replace("Bearer", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.userId;

    const account = Bank.findById(id);

    return account.balance;
  } catch {
    return res.status(404).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to transfer funds

export const transferFunds = async (req, res) => {
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const token = req.header().replace("Beared", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.userId;

    const account = await Bank.findOne({ userId: id }).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Insufficient Balance",
      });
    }

    const reciever = await Bank.findOne({ userId: to }).session(session);

    if (!reciever) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Reciever not found",
      });
    }

    await account
      .updateOne(
        { userId: id },
        {
          $inc: {
            balance: -amount,
          },
        }
      )
      .session(session);
    await reciever
      .updateOne(
        { userId: to },
        {
          $inc: {
            balance: amount,
          },
        }
      )
      .session(session);

    await session.commitTransaction();

    return res.status.json({
      success: true,
      message: "Funds transfered succesfully",
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
