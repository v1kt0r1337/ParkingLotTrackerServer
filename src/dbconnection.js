var mysql = require("mysql");
var config = require("config");

var connection = mysql.createPool({
    // config files must be removed from git tracking before we add cloud solutions.
        connectionLimit : 100,
        host     : config.DBHost,
        user     : config.DBUser,
        password : config.DBPassword,
        database : config.database,
        debug    :  false
});

module.exports = connection;