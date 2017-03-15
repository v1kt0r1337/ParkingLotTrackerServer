/**
 * Created by archheretic on 26.02.17.
 */
let express = require('express');
let router = express.Router();
let config = require("config");
let jwt = require("jsonwebtoken");
// route middleware to verify a token

let tokenVerification = {
    verify: function(req, res, reqAdmin, next) {
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    if (reqAdmin && !req.decoded.admin)
                        return res.status(401).send({
                            success: false,
                            message: 'Failed to authenticate token, only users with admin rights can access this endpoint'
                        });
                    //console.log(req.decoded);
                    next(req, res);
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(401).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};

module.exports = tokenVerification;