// /**
//  * Created by archheretic on 05.02.17.
//  */
// process.env.NODE_ENV = "test";
//
// // this ensures that the other tests runs first.
// require("./parkingLots.test");
// require("./parkingLogs.test");
//
// let connection = require("../src/dbconnection");
// let ParkingLot = require("../src/models/parkingLot.model");
//
// // Require the dev-dependencies
// let chai = require("chai");
// let should = chai.should();
// let expect = chai.expect;
// let assert = chai.assert;
//
//
// describe('hooks', function() {
//     before((done) => {
//         prepareDatabase(() => {
//             done();
//         });
//     });
//
//     describe('/Test ParkingLot.getParkingLots', () => {
//         it('This test should not get any parkingLots', (done) => {
//             ParkingLot.getParkingLots(function (err, data) {
//                 data.should.be.empty;
//                 done();
//             });
//         });
//     });
//
//     let parkingLot = {
//         "name": "fisk",
//         "capacity": 77,
//         "reservedSpaces": 10
//     };
//     describe('hooks', function () {
//         before((done) => {
//             ParkingLot.addParkingLot(parkingLot.name, parkingLot.capacity, parkingLot.reservedSpaces, (err) => {
//                 done();
//             })
//         });
//         describe('/Test ParkingLot.addParkingLot', () => {
//             it('One more row of data should have been inserted', (done) => {
//                 ParkingLot.getParkingLots(function (err, rows) {
//                     let data;
//                     if (err) {
//                         data = parseRowData(err);
//                     }
//                     else {
//                         data = parseRowData(rows);
//                     }
//                     data.should.be.not.empty;
//                     firstRow = parseRowData(data);
//                     firstRow = JSON.parse(data)[0];
//                     // variable extracted for another test.
//                     parkingLot = firstRow;
//                     assert.notEqual(firstRow, undefined);
//                     secondRow = JSON.parse(data)[2];
//                     assert.equal(secondRow, undefined);
//                     done();
//                 });
//             });
//         });
//
//         describe('/Test ParkingLot.getParkingLotById', () => {
//             it('Should get a parkingLot with same field values as the previously inserted parkingLot', (done) => {
//                 ParkingLot.getParkingLotById(parkingLot.id, function (err, rows) {
//                     let data;
//                     if (err) {
//                         data = parseRowData(err);
//                     }
//                     else {
//                         data = parseRowData(rows);
//                     }
//                     data.should.be.not.empty;
//                     firstRow = parseRowData(data);
//                     firstRow = JSON.parse(data)[0];
//                     assert.notEqual(firstRow, undefined);
//                     expect(firstRow.reservedSpaces).to.equal(parkingLot.reservedSpaces);
//                     expect(firstRow.capacity).to.equal(parkingLot.capacity);
//                     secondRow = JSON.parse(data)[2];
//                     assert.equal(secondRow, undefined);
//                     done();
//                 });
//             });
//         });
//
//         describe('hooks', function () {
//             before((done) => {
//                     ParkingLot.updateParkingLot(parkingLot.id, "lilleputt", 5, 1, (err) => {
//                         done();
//                     })
//             });
//             describe('/Test ParkingLot.updateParkingLot', () => {
//                 it('One row of parkingLot data should have been updated', (done) => {
//                     ParkingLot.getParkingLots(function (err, rows) {
//                         let data;
//                         if (err) {
//                             data = parseRowData(err);
//                         }
//                         else {
//                             data = parseRowData(rows);
//                         }
//                         data.should.be.not.empty;
//                         firstRow = parseRowData(data);
//                         firstRow = JSON.parse(data)[0];
//                         assert.notEqual(firstRow, undefined);
//                         expect(firstRow.name).to.equal("lilleputt");
//                         expect(firstRow.reservedSpaces).to.equal(1);
//                         expect(firstRow.capacity).to.equal(5);
//
//                         done();
//                     });
//                 });
//             });
//         });
//
//     });
//
// });
//
// function prepareDatabase(callback)
// {
//     deleteAllParkingLogData( () => {
//         deleteAllParkingLotData(callback);
//     });
// }
//
// function deleteAllParkingLogData(callback) {
//     let query = "DELETE FROM parkingLog";
//     connection.query(query, callback);
//     console.log("deleteAllParkingLogsData");
//     //callback();
// }
//
// function deleteAllParkingLotData(callback) {
//     var query = "DELETE FROM parkingLot";
//     connection.query(query, callback);
//     console.log("deleteAllParkingLotData");
// }
//
// function parseRowData(rowdata)
// {
//     rowdata = JSON.stringify(rowdata);
//     return rowdata;
// }
