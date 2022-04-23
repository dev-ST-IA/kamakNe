const express = require("express");
const app = express();
const UserRoute = require("./User");
const PostRoute = require("./post");
const authMiddleWare = require("../middlewares/auth");

app.use("/user", UserRoute);
// app.use(authMiddleWare);
app.use("/post", PostRoute);

module.exports = app;
