/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";
var db = require("../dbconnection");
var mysql = require("mysql");

var parkingLot = {
    /**
     * Returns all parkingLot from the database.
     */
    getParkingLots: function(callback) {
        db.query("SELECT * FROM parkingLot", callback);
    },

    /**
     * Creates new parkingLot.
     */
    addParkingLot: function(name, capacity, reservedSpaces, callback) {
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["parkingLot", "name", "capacity", "reservedSpaces",
            name, capacity, reservedSpaces];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Returns a parkingLot based on id.
     */
    getParkingLotById : function(id, callback) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["parkingLot", "id", id];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Updates a parkingLot based on id.
     */
    updateParkingLot : function(id, name, capacity, reservedSpaces, callback) {
        var query = "UPDATE parkingLot SET name = ?, capacity = ?, reservedSpaces = ? WHERE id = ?";
        var table = [name, capacity, reservedSpaces, id];
        query = mysql.format(query, table);
        db.query(query, callback);
    }
};

module.exports = parkingLot;