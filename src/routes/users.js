/**
 * Created by archheretic on 26.02.17.
 */
/* jshint node: true */
"use strict";

let express = require('express');
let router = express.Router();
let User = require('../models/user.model');
let authorize = require('./authorize');

router.get('/', function(req, res) {
    authorize.verify(req,res, true, function(req,res) {
        User.getUsers(function(err, rows) {
            if (err) {
                res.json({err});
            }
            else {
                res.json({"users" : rows});
            }
        });
    });
});

router.get('/:id', function(req, res) {
    authorize.verify(req,res, false, function(req,res) {
        // also need to check that req.params.deviceId is the same as the req.decoded.deviceId
        User.getUserById(req.params.id, function(err, rows) {
            if (err) {
                res.json({err});
            }
            else {
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
                res.json({err});
            }
            else {
                res.json({"Message" : "Parking Lot Added"});
            }
        });
});
module.exports = router;