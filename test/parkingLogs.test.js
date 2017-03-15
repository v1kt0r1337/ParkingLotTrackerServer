/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that parkingLots.test runs first.
require("./parkingLots.test");
const server = require('../src/server');
const connection = require("../src/dbconnection");
const parkingLogs = require("../src/routes/parkingLogs");
const ParkingLot = require("../src/models/parkingLot.model");
const ParkingLog = require("../src/models/parkingLog.model");
const User = require("../src/models/user.model");
const async = require("async");

// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const supertest = require('supertest');
// THIS HARDCODED ADRESS MIGHT CAUSE PROBLEMS!
const api = supertest('http://localhost:3000');

const config = require("config");

chai.use(chaiHttp);


let parkinglot;
let adminToken;
let userToken;

describe('hooks prepareDatabase', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
        });
    });

    describe('/POST authenticate admin user for parkinglot tests', () => {
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
                    adminToken = res.body.token;
                })
        });
    });

    describe('/POST authenticate a normal user for parkinglot tests', () => {
        it('Should authenticate a normal user', () => {
            let normalUser = {
                deviceId: "ordinary",
                name: "joe",
                admin: false,
                password: "pwd"
            };

            //console.log("utenfor chaii request");
            return chai.request(server)
                .post('/api/v0/auth')
                .send(normalUser)
                .then((res) => {
                    //console.log("inni chaii request");

                    res.should.have.status(200);
                    userToken = res.body.token;
                    //console.log("res ", res);
                    // console.log("adminToken", adminToken);
                })
        });
    });

    /**
     * Tests the prepareDatabase functions have executed correctly
     */
    describe('/GET parkinglots', () => {
        it('Tests the prepareDatabase functions in parkingLogs.test.js have executed correctly', () => {
            return chai.request(server)
                .get('/api/v0/parkinglots/')
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body.parkingLots).to.not.be.empty;
                })
        });
    });

    describe('/GET parkingLogs', () => {
        it('This GET test should get a 204 as no parkinglogs exist', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/parkinglogs/')
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkingLog/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/GET parkingLogs/latest', () => {
        it('This GET test should get a 204 as no parkinglogs exist', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/parkinglogs/latest')
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkingLog/latest: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/GET parkingLogs/latest/:id', () => {
        it('This GET test should get a 204 as no parkinglogs exist', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/parkinglogs/latest/1')
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkingLog/latest/:id \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });


    describe('/POST parkinglogs', () => {
        it('it should NOT POST, lacks parkingLot_id field', () => {
            let parkingLog = {
                "currentParked": 20,
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : \n \n ${err.message}`));
                        }
                        return resolve();
                    });
            });
        });
    });

    describe('/POST parkinglogs', () => {
        it('it should POST', () => {
            let parkingLog = {
                "currentParked": 800,
                "parkingLot_id": parkinglot.id,
            };
            console.log(parkingLog);
            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
                .set('x-access-token', adminToken)
                .then((res) => {
                    console.log(parkingLog);
                    res.should.have.status(201);
                    //console.log(res.body);
                    res.body.should.not.have.property('err');
                })
        });
    });

    describe('/POST parkinglogs', () => {
        it('it should not POST, User does not provide token', () => {
            let parkingLog = {
                "currentParked": 700,
                "parkingLot_id": parkinglot.id,
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : \n \n ${err.message}`));
                        }
                        return resolve();
                    });
            });
        });
    });

    describe('/POST parkinglogs', () => {
        it('it should not POST, User does not have admin access', () => {
            let parkingLog = {
                "currentParked": 700,
                "parkingLot_id": parkinglot.id,
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .set('x-access-token', userToken)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkingLog/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })
        });
    });

    let id = "";
    describe('/GET parkinglogs', () => {
        it('it should GET all the parkinglogs', () => {
            return chai.request(server)
                .get('/api/v0/parkinglogs/')
                .then((res) => {
                    res.should.have.status(200);
                    id = res.body.parkingLogs[0].id;
                    res.body.should.be.a('object');
                    expect(res.body.parkingLogs).not.be.empty;
                })
        });
    });

    describe('/GET/:id parkinglogs', () => {
        it('it should GET a parkinglog by the given id', () => {
            return chai.request(server)
                .get('/api/v0/parkinglogs/' + id)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    expect(res.body.parkingLogs).to.not.be.empty;
                    res.body.parkingLogs[0].should.have.property('currentParked');
                    res.body.parkingLogs[0].should.have.property('parkingLot_id');
                    res.body.parkingLogs[0].should.have.property('logDate');
                    res.body.parkingLogs[0].should.have.property('id');
                    //console.log(res.body);
                })
        });
    });


    describe('/PUT parkinglogs', () => {
        it('it should PUT/UPDATE a parking log', () => {
            let parkingLog = {
                "currentParked": 10,
                "id": id
            };
            return chai.request(server)
                .put('/api/v0/parkinglogs/')
                .send(parkingLog)
                .set('x-access-token', adminToken)
                .then((res) => {
                    res.should.have.status(200);
                    //console.log(res.body);
                    res.body.should.not.have.property('err');
                })
        });
    });

    describe('/PUT parkinglogs', () => {
        it('it should not PUT/UPDATE a parking log, User does not have admin access', () => {
            let parkingLog = {
                "currentParked": 90,
                "id": id
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .set('x-access-token', userToken)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to PUT /api/v0/parkingLog/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/PUT parkinglogs', () => {
        it('it should not PUT/UPDATE a parking log, User does not provide token', () => {
            let parkingLog = {
                "currentParked": 90,
                "id": id
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to PUT /api/v0/parkingLog/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/PUT parkinglogs', () => {
        it('it should not find a parkinglog to update and get a 204', () => {
            let parkingLog = {
                "currentParked": 90,
                "id": 99999
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .set('x-access-token', adminToken)
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to PUT /api/v0/parkingLog/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/PUT parkinglogs', () => {
        it('it should fail to PUT/UPDATE a parking log due to missing field', () => {
            let parkingLog = {
                "id": id
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglogs/')
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : \n \n ${err.message}`));
                        }
                        return resolve();
                    });
            });
        });
    });

    describe('/GET/:id parkinglogs', () => {
        it('GET :id Test checking that last test actually updated the parking log', () => {
            return chai.request(server)
                .get('/api/v0/parkinglogs/' + id)
                .set('x-access-token', adminToken)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    res.body.parkingLogs[0].should.have.property('currentParked');
                    res.body.parkingLogs[0].should.have.property('parkingLot_id');
                    res.body.parkingLogs[0].should.have.property('logDate');
                    res.body.parkingLogs[0].should.have.property('id');
                    res.body.parkingLogs[0].currentParked.should.be.equal(10);
                })
        });
    });

    describe('/DELETE/:id parkinglogs', () => {
        it('it should not DELETE a parking log, User does not provide token', () => {
            return new Promise((resolve, reject) => {
                api.delete('/api/v0/parkinglogs/' + id)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : \n \n ${err.message}`));
                        }
                        return resolve();
                    });
            });

        });
    });

    describe('/DELETE/:id parkinglogs', () => {
        it('it should not DELETE a parking log, User does have admin access', () => {
            return new Promise((resolve, reject) => {
                api.delete('/api/v0/parkinglogs/' + id)
                    .set('x-access-token', userToken)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to DELETE /api/v0/parkingLog/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/DELETE/:id parkinglogs', () => {
        it('DELETE :id Tests that the DELETE parkinglogs route work', () => {
            return chai.request(server)
                .delete('/api/v0/parkinglogs/' + id)
                .set('x-access-token', adminToken)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    //console.log(res.body);
                })
        });
    });

    describe('/GET/:id parkinglogs', () => {
        it('GET :id Tests that the DELETE route actually deleted the log', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/parkinglogs/' + id)
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkingLog/:id  \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })
        });
    });

    describe('/DELETE/:id parkinglogs', () => {
        it('DELETE :id Tests that it returns 204 if the parkinglog to be deleted is not found', () => {
            return new Promise((resolve, reject) => {
                api.delete('/api/v0/parkinglogs/' + id)
                    .set('x-access-token', adminToken)
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkingLog/:id  \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    let lastInserted = 0;
    let secondLastInserted = 0;
    describe('hooks before GET Latest', function() {
        before((done) => {
            let i = 0;
            let asyncTasks = [];
            let alternating = 0;
            while (i < 10) {
                let currentParked = i * i + 1;
                let logDate = "2037-01-0" + i + " 11:53:54";
                //let logDate = "2017-01-01 11:53:54";

                asyncTasks.push(function(callback)
                {
                    alternating = 1 - alternating;
                    ParkingLog.addParkingLog((parkinglot.id + alternating), currentParked, logDate, (err) => {
                        if (err)
                            console.log(err);
                        callback();
                    });

                });
                if (i == 9) {
                    lastInserted = currentParked;
                }
                if (i == 8) {
                    secondLastInserted = currentParked;
                }
                i++;

            }
            //console.log("lastInserted " + lastInserted);
            //console.log("secondLastInserted " + secondLastInserted);
            async.parallel(asyncTasks, function(){
                // All tasks are done now
                done();
            });
        });
        describe('/GET latest parkinglog', () => {
            it('GET/parkinglogs/latest Tests that the latest parkinglog gets retrieved', () => {
                return chai.request(server)
                    .get('/api/v0/parkinglogs/latest')
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.should.not.have.property('err');
                        expect(res.body.parkingLogs).to.not.be.empty;

                        res.body.parkingLogs[0].should.have.property('currentParked');
                        res.body.parkingLogs[0].should.have.property('parkingLot_id');
                        res.body.parkingLogs[0].should.have.property('logDate');
                        res.body.parkingLogs[0].should.have.property('id');
                        //console.log(res.body.parkingLogs[0]);
                        res.body.parkingLogs[0].currentParked.should.be.equal(lastInserted);
                        res.body.parkingLogs.length.should.be.equal(1);
                        //
                        // console.log(res.body.parkingLogs[0]);
                    })
            });
        });

        describe('/GET latest parkinglog of a spesific parking lot', () => {
            it('GET/parkinglogs/latest/:i Tests that the latest parkinglog of that spesific parkinglot gets retrieved',
                function() {
                    return chai.request(server)
                        .get('/api/v0/parkinglogs/latest/' + (parkinglot.id))
                        .then((res) => {
                            res.should.have.status(200);
                            res.body.should.not.have.property('err');
                            expect(res.body.parkingLogs).to.not.be.empty;
                            res.body.parkingLogs[0].should.have.property('currentParked');
                            res.body.parkingLogs[0].should.have.property('parkingLot_id');
                            res.body.parkingLogs[0].should.have.property('logDate');
                            res.body.parkingLogs[0].should.have.property('id');
                            //console.log(res.body.parkingLogs[0]);
                            res.body.parkingLogs[0].currentParked.should.be.equal(lastInserted);
                            res.body.parkingLogs.length.should.be.equal(1);
                            // console.log(res.body.parkingLogs[0]);
                        })
                });
        });

        describe('/GET latest parkinglog of another spesific parking place', () => {
            it('GET/parkinglogs/latest/:i Tests that we it also work correctly on other parkinglots',
                function() {
                    return chai.request(server)
                        .get('/api/v0/parkinglogs/latest/' + (parkinglot.id + 1))
                        .then((res) => {
                            res.should.have.status(200);
                            res.body.should.not.have.property('err');
                            expect(res.body.parkingLogs).to.not.be.empty;

                            res.body.parkingLogs[0].should.have.property('currentParked');
                            res.body.parkingLogs[0].should.have.property('parkingLot_id');
                            res.body.parkingLogs[0].should.have.property('logDate');
                            res.body.parkingLogs[0].should.have.property('id');
                            //console.log(res.body.parkingLogs[0]);
                            res.body.parkingLogs[0].currentParked.should.be.equal(secondLastInserted);
                            res.body.parkingLogs.length.should.be.equal(1);
                            //console.log(res.body.parkingLogs[0]);
                        })
                });
        });

        describe('/POST parkinglogs/increment', () => {
            it('it tries to POST through parkinglogs/increment route, but should NOT POST, lacks parkingLot_id field', () => {
                let parkingLog = {
                    "increment": 1
                };
                return new Promise((resolve, reject) => {
                    api.post('/api/v0/parkinglogs/increment')
                        .send(parkingLog)
                        .expect(400)
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : \n \n ${err.message}`));
                            }
                            return resolve();
                        });
                });

            });
        });


        describe('/POST parkinglogs/increment', () => {
            it('it tries to POST through parkinglogs/increment route, but should NOT POST, lacks increment field', () => {
                let parkingLog = {
                    "parkingLot_id": parkinglot.id
                };
                return new Promise((resolve, reject) => {
                    api.post('/api/v0/parkinglogs/increment')
                        .set('x-access-token', adminToken)
                        .send(parkingLog)
                        .expect(500)
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkinglogs/: \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })
            });
        });

        describe('/POST parkinglogs/increment', () => {
            it('it should not POST, User does not have admin access', () => {
                let parkingLog = {
                    "increment": 1,
                    "parkingLot_id": parkinglot.id,
                    "parkingLog": "2011-01-0 11:53:54"
                };
                return new Promise((resolve, reject) => {
                    api.post('/api/v0/parkinglogs/increment')
                        .send(parkingLog)
                        .set('x-access-token', userToken)
                        .expect(401)
                        .expect((res) => {
                            expect(res.status).to.equal(401);
                            expect(res.unauthorized).to.be.true;
                        })
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkingLog/increment: \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })

            });
        });

        describe('/POST parkinglogs/increment', () => {
            it('it should not POST, User does not provide token', () => {
                let parkingLog = {
                    "increment": 1,
                    "parkingLot_id": parkinglot.id,
                    "parkingLog": "2011-01-0 11:53:54"
                };
                return new Promise((resolve, reject) => {
                    api.post('/api/v0/parkinglogs/increment')
                        .send(parkingLog)
                        .expect(401)
                        .expect((res) => {
                            expect(res.status).to.equal(401);
                            expect(res.unauthorized).to.be.true;
                        })
                        .end((err, res) => {
                            if (err) {
                                return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkingLog/increment: \n \n ${err.message}`))
                            }
                            return resolve()
                        })
                })

            });
        });

        describe('/POST parkinglogs/increment', () => {
            it('it should POST', () => {
                let parkingLog = {
                    "increment": 1,
                    "parkingLot_id": parkinglot.id,
                    "parkingLog": "2011-01-0 11:53:54"
                };
                //console.log(parkingLog);
                return chai.request(server)
                    .post('/api/v0/parkinglogs/increment')
                    .send(parkingLog)
                    .set('x-access-token', adminToken)
                    .then((res) => {
                        //console.log(parkingLog);
                        res.should.have.status(201);
                        //console.log(res.body);
                        res.body.should.not.have.property('err');
                    })
            });
        });

        // just to debug a weird bug on Travis-CI
        describe('/GET parkinglogs', () => {
            it('it should GET all the parkinglogs', () => {
                return chai.request(server)
                    .get('/api/v0/parkinglogs/')
                    .then((res) => {
                        res.should.have.status(200);
                        //console.log(res.body.parkingLogs);
                    })
            });
        });
    });
});

/**
 * Preparing the database for testing, minimum 1 parkingLot is required to test the parkinglogs api.
 * @param callback
 */

function prepareDatabase(callback) {
    deleteAllUsers( () => {
        addUsers(() => {
            deleteAllParkingLogData(() => {
                deleteAllParkingLotData(() => {
                    addParkingLotData(() => {
                        setParkingLot(callback);
                    });
                });
            });
        });
    });
}

function deleteAllUsers(callback) {
    let query = "DELETE FROM user";
    connection.query(query, callback);
    console.log("deleteAllUsers");
}

function addUsers(callback) {
    let asyncTasks = [];
    asyncTasks.push(function(callback) {
        User.addUser("humbug", "humbugName", true,"pwd", (err, row) => {
            if (err) console.log("err ", err);
            //else console.log(row);
            callback();
        });
    });
    asyncTasks.push(function(callback) {
        User.addUser("ordinary", "joe", false, "pwd", callback);
    });
    async.series(asyncTasks, function(){
        // All tasks are done now
        callback();
        console.log("all users added");
    });
}

function deleteAllParkingLogData(callback) {
    let query = "DELETE FROM parkingLog";
    connection.query(query, callback);
    console.log("deleteAllParkingLogsData");
}

function deleteAllParkingLotData(callback) {
    let query = "DELETE FROM parkingLot";
    connection.query(query, callback);
    console.log("deleteAllParkingLotsData");
}

function addParkingLotData(callback) {

    let asyncTasks = [];

    let query1 =
        "INSERT INTO parkingLot (name, capacity, reservedSpaces) VALUES ('Student Organisasjonen', 100, 10)";
    asyncTasks.push(function(callback) {
        connection.query(query1, callback);
    });

    let query2 =
        "INSERT INTO parkingLot (name, capacity, reservedSpaces) VALUES ('Hokus Pokus', 70, 5)";
    asyncTasks.push(function(callback) {
        connection.query(query2, callback);
    });

    console.log("addParkingLotData");
    async.series(asyncTasks, function(){
        // All tasks are done now
        callback();
    });

}

function setParkingLot(callback) {
    console.log("setParkingLot");
    ParkingLot.getParkingLots( (err, rows) => {
        if (err) {
            parkinglot = parseRowDataIntoSingleEntity(rows);
        }
        else {
            parkinglot = parseRowDataIntoSingleEntity(rows);
        }
        console.log("setParkingLot => getParkingLots");
        callback();
    });

}

function parseRowDataIntoSingleEntity(rowdata)
{
    rowdata = JSON.stringify(rowdata);
    // console.log(rowdata);
    rowdata = JSON.parse(rowdata)[0];
    return rowdata;
}