/**
 * Created by archheretic on 03.02.17.
 */
/* jshint node: true */
"use strict";
// External dependencies
var express = require("express");
var bodyParser = require("body-parser");
// Our files
var parkingLots = require("./routes/parkingLots");
var parkingLogs = require("./routes/parkingLogs");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/v0/parkinglots', parkingLots);
app.use('/api/v0/parkinglogs', parkingLogs);

app.listen(3000);
console.log("Server is listening to port 3000");

module.exports = app;
