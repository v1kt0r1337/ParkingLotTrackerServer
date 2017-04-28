/**
 * Created by archheretic on 07.03.17.
 */
// this ensures that the other tests runs first.
require("./parkingLots.test");
require("./parkingLogs.test");
require("./parkingLot.model.test.js");
require("./parkingLog.model.test.js");
require("./users.test.js");

const connection = require("../src/dbconnection");
const User = require("../src/models/user.model");
// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const config = require("config");
const assert = chai.assert;

chai.use(chaiHttp);

describe('hooks prepareDatabase', function() {
    before((done) => {
        console.log("== user.model.test ==");
        prepareDatabase(() => {
            done();
        });
    });
    describe('/Test User.getUsers', () => {
        it('This test should not get any Users', (done) => {
            User.getUsers(function (err, data) {
                data.should.be.empty;
                done();
            });
        });
    });

    let user = {
        "deviceId": "humbug",
        "name": "fisk",
        "admin": true,
        "password": "pwd"
    };
    describe('hooks', function () {
        before((done) => {
            User.addUser(user.deviceId, user.name, user.admin, user.password, (err) => {
                done();
            })
        });
        describe('/Test User.addUser', () => {
            it('One more row of data should have been inserted', (done) => {
                User.getUsers(function (err, rows) {
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
                    assert.notEqual(firstRow, undefined);
                    secondRow = JSON.parse(data)[1];
                    assert.equal(secondRow, undefined);
                    done();
                });
            });
        });

        describe('hooks', function () {
            before((done) => {
                User.updateUser(user.deviceId, "Knerten", user.admin, user.password, (err) => {
                    done();
                })
            });
            describe('/Test User.updateUser', () => {
                it('One row of User data should have been updated', (done) => {
                    User.getUsers(function (err, rows) {
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
                        expect(firstRow.name).to.equal("Knerten");
                        done();
                    });
                });
            });
        });

    });
});

function prepareDatabase(callback) {
    deleteAllUsers(callback);
}

function deleteAllUsers(callback) {
    let query = "DELETE FROM user";
    connection.query(query, callback);
    console.log("deleteAllUsers");
}

function parseRowData(rowdata) {
    rowdata = JSON.stringify(rowdata);
    return rowdata;
}
