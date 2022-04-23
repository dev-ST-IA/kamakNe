require("dotenv").config();
require("./config/db").connect();
const path = require("path");
const express = require("express");
const cors = require("cors");
const apiResponse = require("./helpers/apiResponse");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const corsOpts = {
  origin: "*",
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Authorization",
  ],
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOpts));
app.use(helmet());
app.use(logger("common"));

app.use("/", indexRouter);
app.use("/api", apiRouter);

app.all("*", (req, res) => {
  return apiResponse.notFoundResponse(res, "Page Not Found");
});

app.use((err, req, res) => {
  return apiResponse.unauthorizedResponse(res, err.message);
});

module.exports = app;
