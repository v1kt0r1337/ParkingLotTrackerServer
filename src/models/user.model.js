/**
 * Created by archheretic on 26.02.17.
 */
/**
 * Created by archheretic on 24.02.17.
 */
/* jshint node: true */
"use strict";
let db = require("../dbconnection");
let mysql = require("mysql");

let user = {
    /**
     * Returns all users from the database.
     */
    getUsers: function(callback) {
        db.query("SELECT * FROM user", callback);
    },

    /**
     * Creates new user.
     */
    //
    // deviceId VARCHAR (64) NOT NULL,
    // name VARCHAR (32) NOT NULL,
    // admin BOOLEAN NOT NULL,
    // password VARCHAR (256) NOT NULL

    addUser: function(deviceId, name, admin=false, password, callback) {
        let query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        let table = ["user", "deviceId", "name", "admin", "password",
            deviceId, name, admin, password];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Returns a parkingLot based on id.
     */
    getUserById : function(deviceId, callback) {
        console.log(deviceId);
        let query = "SELECT * FROM ?? WHERE ??=?";
        let table = ["user", "deviceId", deviceId];
        query = mysql.format(query, table);
        console.log(query);
        db.query(query, callback);
    },

    /**
     * Updates a user based on id.
     */
    updateUser : function(deviceId, name, admin=false, password, callback) {
        let query = "UPDATE user SET name = ?, admin = ?, password = ? WHERE deviceId = ?";
        let table = [name, admin, password, deviceId];
        query = mysql.format(query, table);
        db.query(query, callback);
    }

};

module.exports = user;