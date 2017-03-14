/**
 * Created by archheretic on 26.02.17.
 */

let express = require('express');
let router = express.Router();
let config = require("config");
let jwt = require("jsonwebtoken");
let User = require('../models/user.model');
let utility = require('../models/utility');

let env = config.util.getEnv('NODE_ENV');

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
            console.log("user ", user);
            if (user.password != req.body.password) {
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