const mainRouter = require("./routes/index");
const userRouter = require("./routes/user");
const cors = require("cors");

const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);
app.use("/api/v1/user", userRouter);
