const express = require("express");
const app = express();
const mainRouter = require("./routes/index");

const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;

require("./configuration/database").connect();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
