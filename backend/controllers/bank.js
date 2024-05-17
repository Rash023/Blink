const express = require("express");
const jwt = require("jsonwebtoken");
const Bank = require("../model/bank");

require("dotenv").config();

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
