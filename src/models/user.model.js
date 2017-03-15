/**
 * Created by archheretic on 26.02.17.
 */
/* jshint node: true */
"use strict";
const db = require("../dbconnection");
const mysql = require("mysql");
const bcrypt = require('bcrypt');

const user = {
    /**
     * Returns all users from the database.
     */
    getUsers: function(callback) {
        db.query("SELECT * FROM user", callback);
    },

    /**
     * Creates new user.
     */
    addUser: function(deviceId, name, admin=false, password, callback) {
        let saltRounds = 10;
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(password, salt);
        let query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
        let table = ["user", "deviceId", "name", "admin", "password", "salt",
            deviceId, name, admin, hash, salt];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Returns a parkingLot based on id.
     */
    getUserById : function(deviceId, callback) {
        //console.log(deviceId);
        let query = "SELECT * FROM ?? WHERE ??=?";
        let table = ["user", "deviceId", deviceId];
        query = mysql.format(query, table);
        //console.log(query);
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