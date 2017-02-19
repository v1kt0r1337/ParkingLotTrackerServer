/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";
var db = require("../dbconnection");
var mysql = require("mysql");

var parkingLog = {
    /**
     * Returns all parkingLogs.
     */
    getParkingLogs: function (callback) {
        db.query("SELECT * FROM parkingLog", callback);
    },

    /**
     * Returns the latest parkingLog based on logDate.
     */
    getLatestParkingLog: function(callback) {
        db.query("SELECT * FROM parkingLog ORDER BY logDate DESC LIMIT 1", callback);
    },

    /**
     * Returns a parkingLog based on id
     */
    getParkingLogById: function (id, callback) {
        console.log(id);
        db.query("SELECT * FROM parkingLog WHERE id = ?", [id], callback)
    },

    /**
     * Creates a new parkingLog.
     */
    addParkingLog: function (id, currentParked, callback) {
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["parkingLog", "currentParked", "parkingLot_id",
            currentParked, id];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Updates a parkingLog based on id.
     * Only the currentParked value can be changed.
     */
    updateParkingLog: function (id, currentParked, callback) {
        var query = "UPDATE parkingLog SET currentParked = ? WHERE id = ?";
        var prep = [currentParked, id];
        query = mysql.format(query, prep);
        db.query(query, callback);
    },

    /**
     * Delete the parkingLog with the corresponding id.
     */
    deleteParkingLogById: function(id, callback) {
        var query = "DELETE FROM parkingLog WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = parkingLog;