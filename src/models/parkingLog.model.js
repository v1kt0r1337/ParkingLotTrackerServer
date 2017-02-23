/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";
var db = require("../dbconnection");
var mysql = require("mysql");
var async = require("async");

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
     * Returns the latest parkingLog based on logDate.
     */
    getAParkingLotsLatestParkingLog: function(parkingLot_id, callback) {

        db.query("SELECT * FROM parkingLog WHERE parkingLot_id=? ORDER BY logDate DESC LIMIT 1",
            parkingLot_id, callback);
    },

    /**
     * Returns a parkingLog based on id
     */
    getParkingLogById: function (id, callback) {
        db.query("SELECT * FROM parkingLog WHERE id = ?", [id], callback)
    },

    /**
     * Creates a new parkingLog.
     */
    addParkingLog: function (id, currentParked, logDate, callback) {
        this.newHistoricParkCount(id, currentParked, logDate, (id, currentParked, historicParkCount, logDate ) => {
            insertParkingLog(id, currentParked, historicParkCount, logDate, callback);
        });
    },

    /**
     * Creates a new parkingLog based on the former latest parkinglog, currentParked is incremented/decremented 1 point,
     * And historicParkCount is incremented 1 point IF currentParked was incremented.
     */
    addIncrementedParkingLog: function(id, increment, logDate, callback) {
          this.getAParkingLotsLatestParkingLog(id, (err, row) => {
              if (row) {
                  let currentParked;
                  if (row.length != 0) {
                      row = parseRowDataIntoSingleEntity(row);
                      if (!isNaN(increment)) {
                          increment = parseInt(increment);
                      }
                      currentParked= row.currentParked + increment;
                  }
                  else {
                      currentParked = increment;
                  }
                  this.newHistoricParkCount(id, currentParked, logDate,
                      (id, currentParked, historicParkCount, logDate) => {
                      insertParkingLog(id, currentParked, historicParkCount, logDate, callback);
                  });
              }
          })
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
    },

    /**
     * Checks the totalParked value of the latest dated log, to check if it should increment
     */
    newHistoricParkCount: function(id, currentParked, logDate, callback) {
        this.getAParkingLotsLatestParkingLog(id, (err, rows) => {
            let old;
            let increment = 0;
            if (err) {
                // This should probably be looked closer into.
                console.log("err in function newHistoricParkCount");
                old = parseRowDataIntoSingleEntity(rows);
            }
            else {
                old = parseRowDataIntoSingleEntity(rows);
            }
            // if old is undefined then there are no parkinglogs for this parkinglot.
            if (!old) {
                callback(id, currentParked, currentParked, logDate);
                return;
            }
            if (currentParked > old.currentParked) {
                // This allows for a potentially greater increment then just 1,
                // something that should perhaps be looked deeper into later.
                increment = currentParked - old.currentParked;
            }
            let historicParkCount = old.historicParkCount + increment;
            callback(id, currentParked, historicParkCount, logDate);
        });
    }
};

module.exports = parkingLog;


function parseRowDataIntoSingleEntity(rowdata)
{
    rowdata = JSON.stringify(rowdata);
    // console.log(rowdata);
    rowdata = JSON.parse(rowdata)[0];
    return rowdata;
}

/**
 * Insert parkingLog. This function is called from the addParkingLog method, if called directly ensure that
 * the historicParkCount is a correct increment of the "old latest"
 */
function insertParkingLog(id, currentParked, historicParkCount, logDate, callback) {
    if (typeof logDate === "undefined") {
        //console.log("inside if");
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["parkingLog", "currentParked", "parkingLot_id", "historicParkCount",
            currentParked, id, historicParkCount];
    }
    else {
        //console.log("inside else");
        //console.log("logDate: ", logDate);
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["parkingLog", "currentParked", "parkingLot_id", "logDate", "historicParkCount",
            currentParked, id, logDate, historicParkCount];
    }
    query = mysql.format(query, table);
    db.query(query, callback);
}