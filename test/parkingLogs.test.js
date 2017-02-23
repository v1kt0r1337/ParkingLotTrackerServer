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
let config = require("config");

chai.use(chaiHttp);


let parkinglot;

describe('hooks prepareDatabase', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
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
                "currentParked": 20
            };

            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
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
                "parkingLot_id": parkinglot.id
            };
            console.log(parkingLog);
            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
                .then((res) => {
                    console.log(parkingLog);
                    res.should.have.status(200);
                    //console.log(res.body);
                    res.body.should.not.have.property('err');
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
                .then((res) => {
                    res.should.have.status(200);
                    //console.log(res.body);
                    res.body.should.not.have.property('err');
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
        it('DELETE :id Tests that the DELETE parkinglogs route work', () => {
            return chai.request(server)
                .delete('/api/v0/parkinglogs/' + id)
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
                let logDate = "2099-01-0" + i + " 11:53:54";
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
                        res.body.parkingLogs[0].currentParked.should.be.equal(lastInserted);
                        //console.log(parkingLogs);
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
                        res.body.parkingLogs[0].currentParked.should.be.equal(secondLastInserted);
                        res.body.parkingLogs.length.should.be.equal(1);
                        //console.log(res.body.parkingLogs[0]);
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
    deleteAllParkingLogData( () => {
        deleteAllParkingLotData( () => {
            addParkingLotData( () => {
                setParkingLot(callback);
           });
        });
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