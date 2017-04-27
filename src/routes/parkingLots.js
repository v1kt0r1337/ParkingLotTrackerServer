/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";

const express = require('express');
const router = express.Router();
const ParkingLot = require('../models/parkingLot.model');
const authorize = require('./authorize');
const config = require("config");
const env = config.util.getEnv('NODE_ENV');

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
    if (!req.body.name || !req.body.capacity || !req.body.reservedSpaces || !req.body.lat || !req.body.lng) {
        res.status(400).send({
            success: false,
            message: "The parking lots id in the request body is not defined"
        });
        return;
    }
    authorize.verify(req,res, true, function(req,res) {
        ParkingLot.addParkingLot(req.body.name, req.body.capacity, req.body.reservedSpaces, req.body.lat, req.body.lng,
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
    if (!req.body.id) {
        res.status(400).send({
            success: false,
            message: "The parking lots id in the request body is not defined"
        });
        return;
    }
    authorize.verify(req,res, true, function(req,res) {

        ParkingLot.updateParkingLot(req.body.id, req.body.name, req.body.capacity, req.body.reservedSpaces,
            req.body.lat, req.body.lng,
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


