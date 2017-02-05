/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that the other tests runs first.
require("./parkingLots.test");
require("./parkingLogs.test");

let connection = require("../src/dbconnection");
let ParkingLot = require("../src/models/ParkingLot");

// Require the dev-dependencies
let chai = require("chai");
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

let parkinglot;
describe('hooks', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
        });
    });

    describe('/Test ParkingLot.getParkingLots', () => {
        it('This test should not get any parkingLots', (done) => {
            ParkingLot.getParkingLots(function (err, data) {
                data.should.be.empty;
                done();
            });
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
