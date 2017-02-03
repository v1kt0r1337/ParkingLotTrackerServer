/**
 * Created by archheretic on 03.02.17.
 */
/* jshint node: true */
"use strict";

var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var rest = require("./rest.js");
var app = express();
var config = require("config"); //db location from the JSON files

function server(){
    var self = this;
    self.connectMysql();
};

server.prototype.connectMysql = function() {
    var self = this;
    // Such information should not be available in our public repo when we start using an actual database.
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : config.DBHost,
        user     : config.DBUser,
        password : config.DBPassword,
        database : config.database,
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
}

server.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api/v0', router);
    var restRouter = new rest(router,connection);
    self.startServer();
}

server.prototype.startServer = function() {
    app.listen(3000,function(){
        console.log("Server is listening on Port 3000.");
    });
}

server.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new server();

//module.exports server; // required for testing