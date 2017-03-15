/**
 * Created by archheretic on 26.02.17.
 */
/* jshint node: true */
"use strict";

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authorize = require('./authorize');

const config = require("config");
const env = config.util.getEnv('NODE_ENV');

router.get('/', function(req, res) {
    authorize.verify(req,res, true, function(req,res) {
        User.getUsers(function(err, rows) {
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
                // no point with 404 because its unreachable
                res.json({"users" : rows});
            }
        });
    });
});

router.get('/:id', function(req, res) {
    //console.log(req.params.id);
    authorize.verify(req,res, false, function(req,res) {

        console.log(req.decoded.deviceId);
        console.log(req.params.id);
        if (req.decoded.deviceId != req.params.id) {
            res.status(401).send({
                success: false,
                message: 'Failed to retrieve user, the token does not belong to the the requested user'
            });
            return;
        }
        User.getUserById(req.params.id, function(err, rows) {
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
                // no point with 404 because its unreachable
                res.json({"users" : rows});
            }
        });
    });
});

/**
 * Route for creating new users.
 */
router.post("/", function(req, res) {
    User.addUser(req.body.deviceId, req.body.name, false, req.body.password,
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
                    message: 'User Added'
                });
            }
        });
});
module.exports = router;