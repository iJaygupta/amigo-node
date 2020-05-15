var express = require("express");
var lookupRouter = require("./lookup");

var app = express();

app.use("/lookup/", lookupRouter);

module.exports = app;