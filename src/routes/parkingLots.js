/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var parkingLot = require('../models/parkingLot');

/**
 * Route to get all parking lots.
 */
router.get("/", function(req, res) {
    parkingLot.getParkingLots(function(err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({"parkingLots" : rows});
        }
    });
});

/**
 * Route for creating new parking lots.
 */
router.post("/", function(req, res) {
    parkingLot.addParkingLot(req.body.name, req.body.capacity, req.body.reservedSpaces,
        function(err, rows) {
        if (err) {
            res.json({err});
        }
        else {
            res.json({"Message" : "Parking Lot Added"});
        }
    });
});

/**
 * Route to get a specific parking lot based on id.
 */
router.get("/:id", function(req, res) {
    parkingLot.getParkingLotById(req.params.id, function (err, rows) {
        if (err) {
            res.json({err})
        }
        else {
            res.json({"parkingLots": rows});
        }
    });
});


/**
 * Route to update an existing parking lot.
 * All fields needs to be provided.
 */
router.put("/", function(req, res) {
    if (!req.body.id || !req.body.name || !req.body.capacity || !req.body.reservedSpaces) {
        res.json({"err" : "not all fields are defined"});
        return;
    }
    parkingLot.updateParkingLot(req.body.id, req.body.name, req.body.capacity, req.body.reservedSpaces,
        function(err, rows) {
        if (err)
        {
            res.json({err});
        }
        else
        {
            res.json({"Message" : "Parking Lot Updated"});
        }
    });
});

module.exports = router;


