/**
 * Created by archheretic on 26.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that the other tests runs first.
require("./parkingLots.test");
require("./parkingLogs.test");
require("./parkingLot.model.test.js");
require("./parkingLog.model.test.js");

const server = require('../src/server');
const connection = require("../src/dbconnection");
const users = require("../src/routes/users");
const User = require("../src/models/user.model");

const async = require("async");
// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const supertest = require('supertest');
// THIS HARDCODED ADRESS MIGHT CAUSE PROBLEMS!
const api = supertest('http://localhost:3000');

const config = require("config");

chai.use(chaiHttp);

let user;
let adminToken;
let userToken;
describe('hooks prepareDatabase', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
        });
    });

    // this needs to run first to avoid a synchronous race condition???
    describe('/POST users', () => {
        it('Should insert a user', () => {
            user = {
                deviceId: "dumbug",
                name: "dumbugName",
                admin: true, // this should be ignored as set to false.
                password: "pwd"
            };

            return chai.request(server)
                .post('/api/v0/users')
                .send(user)
                .then((res) => {
                    res.should.have.status(201);
                })
        });
    });

    describe('/POST authenticate admin user for user tests', () => {
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
                    //console.log("res.body.token ", res.body.token);
                    adminToken = res.body.token;
                })
        });
    });

    let normalUser;

    describe('/POST authenticate', () => {
        it('Should fail to authenticate a user due to wrong password', () => {
             normalUser = {
                 deviceId: "ordinary",
                 password: "wrongPassword"
             };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/auth')
                    .send(normalUser)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to POST /api/v0/auth : \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });


    /**
     * Tests the prepareDatabase functions have executed correctly
     */
    describe('/GET users', () => {
        it('Tests the prepareDatabase functions in users.test.js have executed correctly', () => {
            return chai.request(server)
                .get('/api/v0/users/')
                .set('x-access-token', adminToken)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.users.length.should.be.equal(3);
                })
        });
    });


    let newToken;
    describe('/POST authenticate former inserted user for user tests', () => {
        it('Should authenticate former inserted user', () => {
            return chai.request(server)
                .post('/api/v0/auth')
                .send(user)
                .then((res) => {
                    res.should.have.status(200);
                    newToken = res.body.token;
                })
        });
    });

    describe('/GET users', () => {
        it('Tests that the last insert User test was successful, and that the user did not get admin status even while it was requested', () => {
            return chai.request(server)
                .get('/api/v0/users/' + user.deviceId)
                .set('x-access-token', newToken)
                .then((res) => {
                    res.should.have.status(200);
                    //console.log(res.body);
                    res.body.users.should.not.be.empty;
                    expect(res.body.users[0].deviceId).to.equal(user.deviceId);
                    expect(res.body.users[0].name).to.equal(user.name);
                    // password should now be encrypted
                    expect(res.body.users[0].password).to.not.equal(user.password);
                    expect(res.body.users[0].admin).to.equal(0); //aka false.
                })
        });
    });

    describe('/GET users', () => {
        it('it should not GET the users, User does not have admin access', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/users/')
                    .set('x-access-token', newToken)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/GET users/:id', () => {
        it('it should not GET the user, no token provided', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/users/' + user.deviceId)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/users/:id  \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/GET users/:id', () => {
        it('it should not GET the user, token does not match', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/users/' + normalUser.deviceId)
                    .set('x-access-token', newToken)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/users/:id \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/GET users/:id', () => {
        it('it should not GET the user, token is pure gibberish', () => {
            return new Promise((resolve, reject) => {
                api.get('/api/v0/users/' + normalUser.deviceId)
                    .set('x-access-token', 'eyJhbGciOiJIUzI1NiIhdhahadCI6IkpXVCJ9.eyJkZXZpY2VJZCI6Imh1bWJ5asffsad5haWUiOiJPbGUiLCJhZG1pbiI6MCwicGFzc3dvcmQiOiJwd2QiLCJpYXQiOjE0ODg5NjgyMDUsImV4cCI6MTQ4OTA1NDYwNX0.ZCqQ7dPSqZAYSzXIniYAm0U5JipidsjapjjdwaFroyVaaJNo')
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/users/:id \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

});

function prepareDatabase(callback) {
    deleteAllUsers( () => {
        addUsers(callback);
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
