/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that the other tests runs first.
require("./parkingLots.test");
require("./parkingLogs.test");
require("./parkingLot.model.test.js");

let connection = require("../src/dbconnection");
let ParkingLot = require("../src/models/parkingLot.model");
let ParkingLog = require("../src/models/parkingLog.model");

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
        it('This test should get data containing one row', (done) => {
            ParkingLot.getParkingLots(function (err, rows) {
                let data;
                if (err) {
                    data = parseRowData(err);
                }
                else {
                    data = parseRowData(rows);
                }
                //console.log("getParkingLots rows: " + data);
                data.should.be.not.empty;
                secondRow = parseRowData(data);
                parkingLot = JSON.parse(data)[0];
                secondRow = JSON.parse(data)[1];
                assert.equal(secondRow, undefined);
                done();
            });
        });
    });

    describe('/Test ParkingLog.getParkingLogs', () => {
        it('This test should not get any data', (done) => {
            ParkingLog.getParkingLogs(function (err, data) {
                data.should.be.empty;
                done();
            });
        });
    });

    let parkingLog;
    describe('hooks', function() {
        before((done) => {
            let currentParked = 20;
            ParkingLog.addParkingLog(parkingLot.id, currentParked, undefined, (err) => {
                done();
            })
        });
        describe('/Test ParkingLog.addParkingLog', () => {
            it('One more row of data should have been inserted', (done) => {
                ParkingLog.getParkingLogs(function (err, rows) {
                    let data;
                    if (err) {
                        data = parseRowData(err);
                    }
                    else {
                        data = parseRowData(rows);
                    }
                    data.should.be.not.empty;
                    firstRow = parseRowData(data);
                    firstRow = JSON.parse(data)[0];
                    // variable extracted for another test.
                    parkingLog = firstRow;
                    assert.notEqual(firstRow, undefined);
                    secondRow = JSON.parse(data)[2];
                    assert.equal(secondRow, undefined);
                    done();
                });
            });
        });
    });

    describe('/Test ParkingLog.getParkingLogById', () => {
        it('Should get a parkingLog with same field values as the previously inserted parkingLog', (done) => {
            ParkingLog.getParkingLogById(parkingLog.id ,function (err, rows) {
                let data;
                if (err) {
                    data = parseRowData(err);
                }
                else {
                    data = parseRowData(rows);
                }
                data.should.be.not.empty;
                firstRow = parseRowData(data);
                firstRow = JSON.parse(data)[0];
                assert.notEqual(firstRow, undefined);
                firstRow.parkingLot_id.should.be.equal(parkingLog.parkingLot_id);
                expect(firstRow.currentParked).to.equal(parkingLog.currentParked);
                secondRow = JSON.parse(data)[2];
                assert.equal(secondRow, undefined);
                done();
            });
        });
    });

    describe('hooks', function () {
        before((done) => {
            ParkingLog.updateParkingLog(parkingLog.id, 2, (err) => {
                done();
            })
        });
        describe('/Test ParkingLog.updateParkingLog', () => {
            it('One row of parkingLog data should have been updated', (done) => {
                ParkingLog.getParkingLogs(function (err, rows) {
                    let data;
                    if (err) {
                        data = parseRowData(err);
                    }
                    else {
                        data = parseRowData(rows);
                    }
                    data.should.be.not.empty;
                    firstRow = parseRowData(data);
                    firstRow = JSON.parse(data)[0];
                    assert.notEqual(firstRow, undefined);
                    expect(firstRow.currentParked).to.equal(2);
                    expect(firstRow.logDate).to.equal(parkingLog.logDate);
                    expect(firstRow.parkingLot_id).to.equal(parkingLog.parkingLot_id);
                    done();
                });
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
    let query =
        "INSERT INTO parkingLot (name, capacity, reservedSpaces) VALUES ('Student Organisasjonen', 100, 10)";
    connection.query(query, callback);
    console.log("addParkingLotData");
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

function parseRowData(rowdata)
{
    rowdata = JSON.stringify(rowdata);
    return rowdata;
}

function parseRowDataIntoSingleEntity(rowdata)
{
    rowdata = parseRowData(rowdata);
    rowdata = JSON.parse(rowdata)[0];
    return rowdata;
}
