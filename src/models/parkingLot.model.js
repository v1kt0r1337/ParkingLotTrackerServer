/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";
const db = require("../dbconnection");
const mysql = require("mysql");

const parkingLot = {
    /**
     * Returns all parkingLot from the database.
     */
    getParkingLots: function(callback) {
        db.query("SELECT * FROM parkingLot", callback);
    },

    /**
     * Creates new parkingLot.
     */
    addParkingLot: function(name, capacity, reservedSpaces, lat, lng, callback) {
        let query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
        let table = ["parkingLot", "name", "capacity", "reservedSpaces", "lat", "lng",
            name, capacity, reservedSpaces, lat, lng];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Returns a parkingLot based on id.
     */
    getParkingLotById : function(id, callback) {
        let query = "SELECT * FROM ?? WHERE ??=?";
        let table = ["parkingLot", "id", id];
        query = mysql.format(query, table);
        db.query(query, callback);
    },

    /**
     * Updates a parkingLot based on id.
     */
    updateParkingLot : function(id, name, capacity, reservedSpaces, lat, lng, callback) {
        let query = "UPDATE parkingLot SET name = ?, capacity = ?, reservedSpaces = ?, lat = ?, lng = ? WHERE id = ?";
        let table = [name, capacity, reservedSpaces, lat, lng, id];
        query = mysql.format(query, table);
        db.query(query, callback);
    }

};

module.exports = parkingLot;