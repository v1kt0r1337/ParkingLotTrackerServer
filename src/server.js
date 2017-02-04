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

app.use('/api/v0/parkinglots', parkingLots);
app.use('/api/v0/parkinglogs', parkingLogs);


app.listen(3000);
console.log("Server is listening to port 3000");

module.exports = app;

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

else if (app.get('env') !== 'test')
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

*/

