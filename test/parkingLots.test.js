/**
 * Created by archheretic on 04.02.17.
 */
/**
 * Created by archheretic on 03.02.17.
 */

process.env.NODE_ENV = "test";

var server = require('../src/server');
var connection = require("../src/dbconnection")
var parkingLots = require("../src/routes/parkingLots");

// Require the dev-dependencies
var chai = require("chai");
var chaiHttp = require("chai-http");
var should = chai.should();
var expect = chai.expect;
var config = require("config");

chai.use(chaiHttp);

console.log(config.Database);
console.log(config.util.getEnv('NODE_ENV'));

describe('hooks', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
        });
    });

    describe('/GET parkinglots', () => {
        it('This GET test should get an empty parkingLots object', () => {
            console.log("/GET parkinglots");
            return chai.request(server)
                .get('/api/v0/parkinglots/')
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body.parkingLots).to.be.empty;
                })
        });
    });

    describe('/POST parkinglots', () => {
        it('it should NOT POST, lacks capacity field', () => {
            let parkingLot = {
                "name": "tessst",
                "reservedSpaces": 10
            }
            return chai.request(server)
                .post('/api/v0/parkinglots/')
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('err');
                })
        });
    });

    describe('/POST parkinglots', () => {
        it('it should POST', () => {
            parkingLot = {
                "name": "tessst",
                "capacity": 100,
                "reservedSpaces": 10
            }
            return chai.request(server)
                .post('/api/v0/parkinglots/')
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                })
        });
    });

    let id = "";
    describe('/GET parkinglots', () => {
        it('it should GET all the parkinglots', () => {
            return chai.request(server)
                .get('/api/v0/parkinglots/')
                .then((res) => {
                    res.should.have.status(200);
                    id = res.body.parkingLots[0].id;
                    res.body.should.be.a('object');
                    expect(res.body.parkingLots).not.be.empty;
                })
        });
    });

    describe('/GET/:id parkinglots', () => {
        it('it should GET a parkinglot by the given id', () => {

            return chai.request(server)
                .get('/api/v0/parkinglots/' + id)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    expect(res.body.parkingLots).to.not.be.empty;
                    res.body.parkingLots[0].should.have.property('name');
                    res.body.parkingLots[0].should.have.property('capacity');
                    res.body.parkingLots[0].should.have.property('reservedSpaces');

                })
        });
    });

    describe('/PUT parkinglots', () => {
        it('it should fail to PUT/UPDATE a parking lot due to missing field', () => {
            parkingLot = {
                "id": id,
                "name": "newName",
                "capacity": 10,
            };
            return chai.request(server)
                .put('/api/v0/parkinglots/')
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.have.property('err');
                })
        });
    });

    describe('/PUT parkinglots', () => {
        it('it should PUT/UPDATE a parking lot', () => {
            parkingLot = {
                "id": id,
                "name": "newName",
                "capacity": 10,
                "reservedSpaces": 8
            };
            return chai.request(server)
                .put('/api/v0/parkinglots/')
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.not.have.property('err');
                })
        });
    });

    describe('/GET/:id parkinglots', () => {
        it('GET :id Test checking that last test actually updated the parking lot', () => {
            return chai.request(server)
                .get('/api/v0/parkinglots/' + id)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
                    expect(res.body.parkingLots).to.not.be.empty;
                    res.body.parkingLots[0].name.should.be.equal("newName");
                    res.body.parkingLots[0].capacity.should.be.equal(parkingLot.capacity);
                    res.body.parkingLots[0].reservedSpaces.should.be.equal(parkingLot.reservedSpaces);

                })
        });
    });
});

function prepareDatabase(callback)
{
    deleteAllParkingLogData( () => {
        deleteAllParkingLotData(callback);
    });
}

function deleteAllParkingLogData(callback) {
    let query = "DELETE FROM parkingLog";
    connection.query(query, callback);
    console.log("deleteAllParkingLogsData");
    //callback();
}

function deleteAllParkingLotData(callback) {
    var query = "DELETE FROM parkingLot";
    connection.query(query, callback);
    console.log("deleteAllParkingLotData");
}

