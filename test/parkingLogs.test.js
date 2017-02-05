/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that parkingLots.test runs first.
require("./parkingLots.test");
let server = require('../src/server');
let connection = require("../src/dbconnection");
let parkingLogs = require("../src/routes/parkingLogs");
let parkingLot= require("../src/models/ParkingLot");

// Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
let config = require("config");

chai.use(chaiHttp);

let parkinglot;
describe('hooks', function() {
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
            var parkingLog = {
                "currentParked": 20
            }
            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
                .then((res) => {
                    res.should.have.status(200);

                    res.body.should.have.property('err');
                })
        });
    });

    describe('/POST parkinglogs', () => {
        it('it should POST', () => {
            parkingLog = {
                "currentParked": 800,
                "parkingLot_id": parkinglot.id
            }
            console.log(parkingLog);
            return chai.request(server)
                .post('/api/v0/parkinglogs/')
                .send(parkingLog)
                .then((res) => {
                    res.should.have.status(200);
                    console.log(res.body);
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
                })
        });
    });


    describe('/PUT parkinglogs', () => {
        it('it should PUT/UPDATE a parking log', () => {
            parkingLog = {
                "currentParked": 10,
                "id": id
            };
            return chai.request(server)
                .put('/api/v0/parkinglogs/')
                .send(parkingLog)
                .then((res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.not.have.property('err');
                })
        });
    });

    describe('/PUT parkinglogs', () => {
        it('it should fail to PUT/UPDATE a parking log due to missing field', () => {
            parkingLog = {
                "id": id
            };
            return chai.request(server)
                .put('/api/v0/parkinglogs/')
                .send(parkingLog)
                .then((res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.property('err');
                })
        });
    });

    describe('/GET/:id parkinglogs', () => {
        it('GET :id Test checking that last test actually updated the parking log', () => {

            return chai.request(server)
                .get('/api/v0/parkinglogs/') //+ id)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                })
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
    let query =
    "INSERT INTO parkingLot (name, capacity, reservedSpaces) VALUES ('Student Organisasjonen', 100, 10)";
    connection.query(query, callback);
    console.log("addParkingLotData");
}

function setParkingLot(callback) {
    console.log("setParkingLot");
    parkingLot.getParkingLots( (err, rows) => {
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
    console.log(rowdata);
    rowdata = JSON.parse(rowdata)[0];
    return rowdata;
}