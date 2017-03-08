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
    console.log(req.params.id);
    authorize.verify(req,res, false, function(req,res) {

        if (req.decoded.deviceId != req.params.id) {
            res.status(401).send({
                success: false,
                message: 'Failed to retrieve user, the token does not belong to the the requested user'
            });
            return;
        }
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
                res.json({"Message" : "User Added"});
            }
        });
});
module.exports = router;