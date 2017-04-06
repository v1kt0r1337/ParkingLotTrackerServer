/**
 * Created by archheretic on 26.02.17.
 */
/* jshint node: true */
"use strict";
const express = require('express');
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');
const utility = require('../models/utility');
const bcrypt = require('bcrypt');
const env = config.util.getEnv('NODE_ENV');

router.post('/', function(req, res) {
    // find the user
    User.getUserById(req.body.deviceId, function(err, user) {
        if (err || !user || user.length == 0) {
            let message;
            if (env === "dev" || env === "test") {
                message = err;
            }
            message = message || "Internal Server Error";
            return res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            user = utility.parseRowDataIntoSingleEntity(user);
            // check if password matches
            // console.log("req.body.password ", req.body);
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).send({
                    success: false,
                    message: 'Authentication failed. Wrong password and/or deviceId.'
                });
            } else {
                // if user is found and password is right
                // create a token
                let token = jwt.sign(user, config.secret, {
                    expiresIn: "24h" // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

module.exports = router;