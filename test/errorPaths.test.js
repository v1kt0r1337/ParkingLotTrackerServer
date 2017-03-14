/**
 * Created by archheretic on 14.03.17.
 *
 * This should be the last test file to run, all tests after this that requires the database will fail
 */
process.env.NODE_ENV = "test";

// this ensures that the other tests runs first.
require("./parkingLots.test");
require("./parkingLogs.test");
require("./parkingLot.model.test.js");
require("./parkingLog.model.test.js");
require("./user.model.test.js");
require("./users.test.js");

let server = require('../src/server');
let connection = require("../src/dbconnection");
let users = require("../src/routes/users");
// Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;
let supertest = require('supertest');
// THIS HARDCODED ADRESS MIGHT CAUSE PROBLEMS!
let api = supertest('http://localhost:3000');

let config = require("config");

let fs = require('fs');
let path = require('path');
let sqlPath = path.join(__dirname, '..', 'scripts', 'database.sql');

chai.use(chaiHttp);

console.log("This should be the last test file to run, all tests after this that requires the database will fail");


describe('hooks prepareDatabase', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
        });
    });

    describe('/POST authenticate admin user for user tests', () => {
        it('Should authenticate an admin user', () => {
            let admin = {
                deviceId: "humbug",
                name: "humbugName",
                admin: true,
                password: "pwd"
            };

            return chai.request(server)
                .post('/api/v0/auth')
                .send(admin)
                .then((res) => {
                    res.should.have.status(200);
                    //console.log("res.body.token ", res.body.token);
                    adminToken = res.body.token;
                })
        });
    });

    describe('/POST authenticate normal user for user tests', () => {
        it('Should authenticate a normal user', () => {
            normalUser = {
                deviceId: "ordinary",
                password: "pwd"
            };
            return chai.request(server)
                .post('/api/v0/auth')
                .send(normalUser)
                .then((res) => {
                    res.should.have.status(200);
                    userToken = res.body.token;
                })
        });
    });


    /**
     * This Section is ment to trigger the 500 status responses on the users route
     */
    describe('hooks prepareDatabase', function() {
        before((done) => {
            messUpDatabase(() => {
                done();
            });
        });
        describe('/POST authenticate', () => {
            it('Should fail to authenticate a user due to 500', () => {
                normalUser = {
                    deviceId: "ordinary",
                    password: "pwd"
                };
                return new Promise((resolve, reject) => {
                    api.post('/api/v0/auth')
                        .send(normalUser)
                        .expect(500)
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to POST /api/v0/auth : \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })
            });
        });

        describe('/GET users/:id', () => {
            it('it should not GET the user, due to 500', () => {
                return new Promise((resolve, reject) => {
                    api.get('/api/v0/users/' + normalUser.deviceId)
                        .set('x-access-token', userToken)
                        .expect(500)
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to GET /api/v0/users/:id \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })

            });
        });

        describe('/GET users', () => {
            it('it should not GET any users, due to 500', () => {
                return new Promise((resolve, reject) => {
                    api.get('/api/v0/users/')
                        .set('x-access-token', adminToken)
                        .expect(500)
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to GET /api/v0/users \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })

            });
        });


        /**
         * This Section is ment to trigger the 500 status responses on the parkingLots route
         */
        describe('/GET parkinglots', () => {
            it('Should fail to get parkinglots due to 500', () => {
                parkingLot = {
                    "name": "tessst",
                    "reservedSpaces": 10
                };
                return new Promise((resolve, reject) => {
                    api.get('/api/v0/parkinglots/')
                        .expect(500)
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkinglots/: \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })
            });
        });


    //     describe('hooks fixDatabase', function () {
    //         before((done) => {
    //             fixDatabase(() => {
    //                 done();
    //             });
    //         });
    //         describe('/GET parkinglots', () => {
    //             it('Test that the  parkingLot table works again', () => {
    //
    //                 return new Promise((resolve, reject) => {
    //                     api.get('/api/v0/parkinglots/')
    //                         .expect(404)
    //                         .expect((res) => {
    //                             expect(res.status).to.equal(404);
    //                             expect(res.notFound).to.be.true;
    //                         })
    //                         .end((err, res) => {
    //                             if (err) {
    //                                 return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkinglots/: \n \n ${err.message}`))
    //                             }
    //                             return resolve()
    //                         })
    //                 })
    //
    //             });
    //         });
    //
    //         describe('/POST users', () => {
    //             it('tests that user table is working again', () => {
    //                 user = {
    //                     deviceId: "dumbug",
    //                     name: "dumbugName",
    //                     password: "pwd"
    //                 };
    //
    //                 return chai.request(server)
    //                     .post('/api/v0/users')
    //                     .send(user)
    //                     .then((res) => {
    //                         res.should.have.status(201);
    //                     })
    //             });
    //         });
    //     });
    });
});



function messUpDatabase(callback) {
    let query = "DROP DATABASE shitdatabasetest";
    connection.query(query, callback);
    console.log("messedUpDatabase");
}

function prepareDatabase(callback) {
    deleteAllUsers( () => {
        addUsers(callback);
    });
}

function deleteAllUsers(callback) {
    let query = "DELETE FROM user";
    connection.query(query, callback);
    console.log("deleteAllUsers");
}


function addUsers(callback) {
    function addAdminUser(callback) {
        let query =
            "INSERT INTO user (deviceId, name, admin, password) VALUES ('humbug', 'humbugName', true, 'pwd')";
        connection.query(query, callback);
        console.log("addAdminUser");
    }

    function addNormalUser(callback) {
        let query =
            "INSERT INTO user (deviceId, name, admin, password) VALUES ('ordinary', 'joe', false, 'pwd')";
        connection.query(query, callback);
        console.log("addNormalUser");
    }
    addNormalUser(addAdminUser(callback));
}


function fixDatabase(callback) {
    try {
        fs.readFile(sqlPath, 'utf8', function (err, data) {
            try {
                console.log(err);
                let sqlDDL = data.toString();
                console.log(sqlDDL);
                connection.query("CREATE database shitdatabasetest", (err, data) => {
                    console.log(err);
                    console.log(data);
                    callback(err, data);
                });
                console.log("fixDatabase Done");
            }
            catch (err) {

            }
        });
    }
    catch (err) {
        console.log("fixDatabase failed: ", err);
    }

}

