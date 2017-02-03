/**
 * Created by archheretic on 03.02.17.
 */
/* jshint node: true */
"use strict";

var mysql = require("mysql");

function restRouter(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

restRouter.prototype.handleRoutes = function(router, connection) {
    router.get("/", function(req,res)
    {
        res.json({"Message" : "Hello API users!"});
    });

    /**
     * Route to get all parking lots.
     */
    router.get("/parkinglots", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["parkingLot"];
        query = mysql.format(query, table);
        connection.query(query,function(err, rows) {
            if (err) {
                res.json({"Error" : true, "Message" : err});
            }
            else {
                res.json({"ParkingLots" : rows});
            }

        });
    });

    /**
     * Route for creating new parking lots.
     */
    router.post("/parkinglots", function(req, res) {
        console.log(req.body.name);
        console.log(req.body.capacity);
        console.log(req.body.reservedSpaces);

        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["parkingLot", "name", "capacity", "reservedSpaces",
            req.body.name, req.body.capacity, req.body.reservedSpaces];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows)
        {
            if (err)
            {
                res.json({"Error" : true, "Message" : err});
            }
            else
            {
                res.json({"Error" : false, "Message" : "Parking Lot Added"});
            }
        });
    });

    /**
     * Route to get a specific parking lot based on id.
     */
    router.get("/parkinglots/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["parkingLot", "id", req.params.id];
        query = mysql.format(query, table);
        connection.query(query, function(err,rows) {
            if(err) {
                res.json({"Error" : true, "Message" : err})
            }
            else {
                res.json({"ParkingLots" : rows});
            }
        });
    });

    /**
     * Route to update an existing parking lot.
     * All fields needs to be provided.
     */
    router.put("/parkinglots", function(req, res) {
        console.log(req.body.name);
        console.log(req.body.capacity);
        console.log(req.body.reservedSpaces);
        console.log(req.body.id);
        console.log(req.body.tull == null);
        var query = "UPDATE parkingLot SET name = ?, capacity = ?, reservedSpaces = ? WHERE id = ?";
        var table = [req.body.name, req.body.capacity, req.body.reservedSpaces, req.body.id];

        query = mysql.format(query, table);
        connection.query(query, function(err, rows)
        {
            if (err)
            {
                res.json({"Error" : true, "Message" : err});
            }
            else
            {
                res.json({"Error" : false, "Message" : "Parking Lot Updated"});
            }
        });
    });

    /**
     * Route to get all parking logs.
     */
    router.get("/parkinglogs", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["parkingLog"];
        query = mysql.format(query, table);
        connection.query(query,function(err, rows) {
            if (err) {
                res.json({"Error" : true, "Message" : err});
            }
            else {
                res.json({"Parkinglogs" : rows});
            }

        });
    });

    /**
     * Route to get the latest parking log.
     */
    router.get("/parkinglogs/latest", function(req, res) {
        var query = "SELECT * FROM ?? ORDER BY logDate DESC LIMIT 1";
        var table = ["parkingLog"];
        query = mysql.format(query, table);
        connection.query(query, function(err,rows) {
            if(err) {
                res.json({"Error" : true, "Message" : err})
            }
            else {
                res.json({"parkinglogs" : rows});
            }
        });
    });

    /**
     * Route to get a specific parking log based on id.
     */
    router.get("/parkinglogs/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["parkingLog", "id", req.params.id];
        query = mysql.format(query, table);
        connection.query(query, function(err,rows) {
            if(err) {
                res.json({"Error" : true, "Message" : err})
            }
            else {
                res.json({"parkinglogs" : rows});
            }
        });
    });

}

module.exports = restRouter;