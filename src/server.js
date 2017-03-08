/**
 * Created by archheretic on 03.02.17.
 */
/* jshint node: true */
"use strict";
// External dependencies
let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
// Our files
let parkingLots = require("./routes/parkingLots");
let parkingLogs = require("./routes/parkingLogs");

let authenticate = require("./routes/authenticate");
let users = require("./routes/users");


let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// logs requests to the console.
app.use(morgan("dev"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/v0/parkinglots', parkingLots);
app.use('/api/v0/parkinglogs', parkingLogs);

app.use('/api/v0/auth', authenticate);
app.use('/api/v0/users', users);

app.listen(3000);
console.log("Server is listening to port 3000");

module.exports = app;