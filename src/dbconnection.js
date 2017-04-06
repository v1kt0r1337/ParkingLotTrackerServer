/* jshint node: true */
"use strict";

const mysql = require("mysql");
const config = require("config");

console.log("Server is run in " + config.util.getEnv('NODE_ENV') + " mode");
const connection = mysql.createPool({
    // config files must be removed from git tracking before we add cloud solutions.
    connectionLimit : 100,
    host     : config.DBHost,
    user     : config.DBUser,
    password : config.DBPassword,
    database : config.Database,
    debug    :  false
});

module.exports = connection;