/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";


let server = require('../src/server');
let connection = require("../src/dbconnection")
let parkingLogs = require("../src/routes/parkingLogs");
let parkingLot= require("../src/models/parkingLot");

// Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
let config = require("config");

chai.use(chaiHttp);

console.log(config.Database);
console.log(config.util.getEnv('NODE_ENV'));

let parkinglot;
prepareDatabase(startTests());

function startTests()
{
    /**
     * Tests the prepareDatabase functions have executed correctly
     */
    describe('/GET parkinglots', () => {
        it('Tests the prepareDatabase functions have executed correctly', () => {
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
                    console.log(res.body.parkingLogs);
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

    describe('/GET/:id parkinglogs', () => {
        it('GET :id Test checking that last test actually updated the parking log', () => {

            return chai.request(server)
                .get('/api/v0/parkinglogs/' + id)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    expect(res.body.parkingLogs).to.not.be.empty;
                    res.body.parkingLogs[0].currentParked.should.be.equal(10);


                })
        });
    });


}

/**
 * Preparing the database for testing, minimum 1 parkingLot is required to test the parkinglogs api.
 * @param callback
 */
function prepareDatabase(callback) {
    deleteAllParkingLogsData(deleteAllParkingLotsData(addParkingLotData(setParkingLot(callback))));
}

function deleteAllParkingLogsData(callback) {
    let query = "DELETE FROM parkingLog";
    connection.query(query, callback);
}

function deleteAllParkingLotsData(callback) {
    let query = "DELETE FROM parkingLot";
    connection.query(query, callback);
}

function addParkingLotData(callback) {
    let query =
    "INSERT INTO parkingLot (name, capacity, reservedSpaces) VALUES ('Student Organisasjonen', 100, 10)";
    connection.query(query, callback);
    parkinglot = "tull";
}

function setParkingLot(callback) {
    parkingLot.getParkingLots(function(err, rows) {
        if (err) {
            parkinglot = JSON.parse(JSON.stringify(rows))[0];
        }
        else {
            parkinglot = JSON.parse(JSON.stringify(rows))[0];
        }

    });
}