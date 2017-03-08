/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that parkingLots.test runs first.
require("./parkingLots.test");
let server = require('../src/server');
let connection = require("../src/dbconnection");
let parkingLogs = require("../src/routes/parkingLogs");
let ParkingLot = require("../src/models/parkingLot.model");
let ParkingLog = require("../src/models/parkingLog.model");
let async = require("async");

// Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
let supertest = require('supertest');
// THIS HARDCODED ADRESS MIGHT CAUSE PROBLEMS!
let api = supertest('http://localhost:3000');

let config = require("config");

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

    /**
     * Test the /GET route
     */
    describe('/GET parkingLogs', () => {
        it('This GET test should get an empty parkingLogs object', () => {
            return chai.request(server)
                .get('/api/v0/parkinglogs/')
                .then((res) => {
                    res.should.have.status(200);
                    //console.log(res.body.parkingLogs);
                    res.body.should.be.a('object');
                    expect(res.body.parkingLogs).to.be.empty;
                })
        });
    });


    describe('/POST parkinglogs', () => {
        it('it should NOT POST, lacks parkingLot_id field', () => {
            let parkingLog = {
                "currentParked": 20,
                "parkingLog": "2010-01-0 11:53:54"
            };

            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
                .set('x-access-token', adminToken)
                .then((res) => {
                    //console.log(res);
                    //console.log(parkingLog);
                    res.should.have.status(200);
                    res.body.should.have.property('err');
                })
        });
    });

    describe('/POST parkinglogs', () => {
        it('it should POST', () => {
            let parkingLog = {
                "currentParked": 800,
                "parkingLot_id": parkinglot.id,
                "parkingLog": "2009-01-0 11:53:54"
            };
            console.log(parkingLog);
            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
                .set('x-access-token', adminToken)
                .then((res) => {
                    console.log(parkingLog);
                    res.should.have.status(200);
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
                "parkingLog": "2008-01-0 11:53:54"
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .expect(403)
                    .expect((res) => {
                        expect(res.status).to.equal(403);
                        expect(res.forbidden).to.be.true;
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

    describe('/POST parkinglogs', () => {
        it('it should not POST, User does not have admin access', () => {
            let parkingLog = {
                "currentParked": 700,
                "parkingLot_id": parkinglot.id,
                "parkingLog": "2008-01-0 11:53:54"
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglogs/')
                    .send(parkingLog)
                    .set('x-access-token', userToken)
                    .expect(403)
                    .expect((res) => {
                        expect(res.status).to.equal(403);
                        expect(res.forbidden).to.be.true;
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
                    .expect(403)
                    .expect((res) => {
                        expect(res.status).to.equal(403);
                        expect(res.forbidden).to.be.true;
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
                    .expect(403)
                    .expect((res) => {
                        expect(res.status).to.equal(403);
                        expect(res.forbidden).to.be.true;
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
            return chai.request(server)
                .put('/api/v0/parkinglogs/')
                .send(parkingLog)
                .set('x-access-token', adminToken)
                .then((res) => {
                    res.should.have.status(200);
                    //console.log(res.body);
                    res.body.should.property('err');
                })
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
                    .expect(403)
                    .expect((res) => {
                        expect(res.status).to.equal(403);
                        expect(res.forbidden).to.be.true;
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
        it('it should not DELETE a parking log, User does have admin access', () => {
            return new Promise((resolve, reject) => {
                api.delete('/api/v0/parkinglogs/' + id)
                    .set('x-access-token', userToken)
                    .expect(403)
                    .expect((res) => {
                        expect(res.status).to.equal(403);
                        expect(res.forbidden).to.be.true;
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
            return chai.request(server)
                .get('/api/v0/parkinglogs/' + id)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    expect(res.body.parkingLots).to.be.empty;
                    //console.log(res.body);
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
            console.log("lastInserted " + lastInserted);
            console.log("secondLastInserted " + secondLastInserted);
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
                        console.log(res.body.parkingLogs[0]);
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
                            console.log(res.body.parkingLogs[0]);
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
                            console.log(res.body.parkingLogs[0]);
                            res.body.parkingLogs[0].currentParked.should.be.equal(secondLastInserted);
                            res.body.parkingLogs.length.should.be.equal(1);
                            //console.log(res.body.parkingLogs[0]);
                        })
                });
        });

        describe('/POST parkinglogs/increment', () => {
            it('it tries to POST through parkinglogs/increment route, but should NOT POST, lacks parkingLot_id field',
                () => {
                    let parkingLog = {
                        "increment": 1
                    };

                    return chai.request(server)
                        .post('/api/v0/parkinglogs/increment')
                        .send(parkingLog)
                        .set('x-access-token', adminToken)
                        .then((res) => {
                            //console.log(res);
                            //console.log(parkingLog);
                            res.should.have.status(200);
                            res.body.should.have.property('err');
                        })
                });
        });



        describe('/POST parkinglogs/increment', () => {
            it('it tries to POST through parkinglogs/increment route, but should NOT POST, lacks increment field',
                () => {
                    let parkingLog = {
                        "parkingLot_id": parkinglot.id
                    };

                    return chai.request(server)
                        .post('/api/v0/parkinglogs/increment')
                        .send(parkingLog)
                        .set('x-access-token', adminToken)
                        .then((res) => {
                            //console.log(res);
                            //console.log(parkingLog);
                            res.should.have.status(200);
                            res.body.should.have.property('err');
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
                        .expect(403)
                        .expect((res) => {
                            expect(res.status).to.equal(403);
                            expect(res.forbidden).to.be.true;
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
                        .expect(403)
                        .expect((res) => {
                            expect(res.status).to.equal(403);
                            expect(res.forbidden).to.be.true;
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
                console.log(parkingLog);
                return chai.request(server)
                    .post('/api/v0/parkinglogs/increment')
                    .send(parkingLog)
                    .set('x-access-token', adminToken)
                    .then((res) => {
                        console.log(parkingLog);
                        res.should.have.status(200);
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
                        console.log(res.body.parkingLogs);
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
    addAdminUser(addNormalUser(callback));
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