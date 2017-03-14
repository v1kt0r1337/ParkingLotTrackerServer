/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";

let express = require('express');
let router = express.Router();
let ParkingLot = require('../models/parkingLot.model');
let authorize = require('./authorize');
let config = require("config");
let env = config.util.getEnv('NODE_ENV');

/**
 * Route to get all parking lots.
 */
router.get("/", function(req, res) {
    ParkingLot.getParkingLots(function(err, rows) {
        if (err) {
            let message = "Internal Server Error";
            if (env === "dev" || env === "test") {
                message = err;
            }
            res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            if (rows.length === 0) {
                res.status(204).send({
                    success: false,
                    message: 'No parking lots found'
                });
                return;
            }
            res.json({"parkingLots" : rows});
        }
    });
});

/**
 * Route for creating new parking lots.
 */
router.post("/", function(req, res) {
    authorize.verify(req,res, true, function(req,res) {
        ParkingLot.addParkingLot(req.body.name, req.body.capacity, req.body.reservedSpaces,
            function(err, rows) {
                if (err) {
                    let message = "Internal Server Error";
                    if (env === "dev" || env === "test") {
                        message = err;
                    }
                    res.status(500).send({
                        success: false,
                        message: message
                    });
                }
                else {
                    res.status(201).send({
                        success: true,
                        message: 'Parking lot Added'
                    });
                }
            });
    });
});

/**
 * Route to get a specific parking lot based on id.
 */
router.get("/:id", function(req, res) {
    ParkingLot.getParkingLotById(req.params.id, function (err, rows) {
        if (err) {
            let message = "Internal Server Error";
            if (env === "dev" || env === "test") {
                message = err;
            }
            res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            if (rows.length === 0) {
                res.status(204).send({
                    success: false,
                    message: 'Parking lot not found'
                });
                return;
            }
            res.json({"parkingLots": rows});
        }
    });
});


/**
 * Route to update an existing parking lot.
 * All fields needs to be provided.
 */
router.put("/", function(req, res) {
    authorize.verify(req,res, true, function(req,res) {
        if (!req.body.id) {
            res.status(500).send({
                success: false,
                message: "The parking lots id in the request body is defined"
            });
            return;
        }
        ParkingLot.updateParkingLot(req.body.id, req.body.name, req.body.capacity, req.body.reservedSpaces,
            function (err, rows) {
                if (err) {
                    let message = "Internal Server Error";
                    if (env === "dev" || env === "test") {
                        message = err;
                    }
                    res.status(500).send({
                        success: false,
                        message: message
                    });
                }
                else {
                    if (rows.affectedRows == 0) {
                        res.status(204).send({
                            success: false,
                            message: 'Parking lot not found'
                        });
                        return;
                    }
                    res.json({"Message": "Parking Lot Updated"});
                }
            });
    });
});

module.exports = router;


