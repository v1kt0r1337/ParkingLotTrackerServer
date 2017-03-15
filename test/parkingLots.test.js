/**
 * Created by archheretic on 03.02.17.
 */

process.env.NODE_ENV = "test";

let server = require('../src/server');
let connection = require("../src/dbconnection");
let parkingLots = require("../src/routes/parkingLots");

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

console.log(config.Database);
console.log(config.util.getEnv('NODE_ENV'));

let adminToken;
let userToken;
describe('hooks', function() {
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

    describe('/GET parkinglots', () => {
        it('This GET test should get a 204 since no parkinglots exist', () => {

            return new Promise((resolve, reject) => {
                api.get('/api/v0/parkinglots/')
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to GET /api/v0/parkinglots/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/POST parkinglots', () => {
        it('it should NOT POST, lacks capacity field', () => {
            parkingLot = {
                "name": "tessst",
                "reservedSpaces": 10
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglots/')
                    .set('x-access-token', adminToken)
                    .send(parkingLot)
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkinglots/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })
        });
    });

    describe('/POST parkinglots', () => {
        it('it should POST', () => {
            parkingLot = {
                "name": "tessst",
                "capacity": 100,
                "reservedSpaces": 10
            };
            return chai.request(server)
                .post('/api/v0/parkinglots/')
                .set('x-access-token', adminToken)
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(201);
                    res.body.should.not.have.property('err');
                })
        });
    });

    describe('/POST parkinglots', () => {
        it('it should not POST, User does not provide token', () => {
            parkingLot = {
                "name": "tessst2",
                "capacity": 100,
                "reservedSpaces": 10
            };
            return new Promise((resolve, reject) => {
                api.post('/api/v0/parkinglots/')
                    .send(parkingLot)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkinglots/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/POST parkinglots', () => {
        it('it should not POST, User does not have admin access', () => {
            parkingLot = {
                "name": "tessst2",
                "capacity": 100,
                "reservedSpaces": 10
            };
            return new Promise((resolve, reject) => {
            api.post('/api/v0/parkinglots/')
                .set('x-access-token', userToken)
                .send(parkingLot)
                .expect(401)
                .expect((res) => {
                    expect(res.status).to.equal(401);
                    expect(res.unauthorized).to.be.true;
                })
                .end((err, res) => {
                    if (err) {
                        return reject(new Error(`apiHelper Error : Failed to POST /api/v0/parkinglots/: \n \n ${err.message}`))
                    }
                    return resolve()
                })
            })

        });
    });


    let id = "";
    describe('/GET parkinglots', () => {
        it('it should GET all the parkinglots', () => {
            return chai.request(server)
                .get('/api/v0/parkinglots/')
                .set('x-access-token', adminToken)
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
                .set('x-access-token', adminToken)
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
        it('it should fail to PUT/UPDATE a parking lot due to missing field2', () => {
            parkingLot = {
                "name": "newName",
                "capacity": 10,
                "reservedSpaces": 8
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglots')
                    .send(parkingLot)
                    .set('x-access-token', adminToken)
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to PUT /api/v0/parkinglots: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
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
                .set('x-access-token', adminToken)
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.not.have.property('err');
                })
        });
    });

    describe('/PUT parkinglogs', () => {
        it('it should not find a parkingLot to update and get a 204', () => {
            parkingLot = {
                "id": 9001,
                "name": "newName",
                "capacity": 10,
                "reservedSpaces": 8
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglots/')
                    .send(parkingLot)
                    .set('x-access-token', adminToken)
                    .expect(204)
                    .expect((res) => {
                        expect(res.status).to.equal(204);
                        expect(res.noContent).to.be.true;
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


    describe('/PUT parkinglots', () => {
        it('it should not PUT, User does not have admin access', () => {
            parkingLot = {
                "id": id,
                "name": "crackadoodle",
                "capacity": 10,
                "reservedSpaces": 8
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglots/')
                    .set('x-access-token', userToken)
                    .send(parkingLot)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to PUT /api/v0/parkinglots/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/PUT parkinglots', () => {
        it('it should not PUT, User does not provide token', () => {
            parkingLot = {
                "id": id,
                "name": "hackadoodle",
                "capacity": 10,
                "reservedSpaces": 8
            };
            return new Promise((resolve, reject) => {
                api.put('/api/v0/parkinglots/')
                    .send(parkingLot)
                    .expect(401)
                    .expect((res) => {
                        expect(res.status).to.equal(401);
                        expect(res.unauthorized).to.be.true;
                    })
                    .end((err, res) => {
                        if (err) {
                            return reject(new Error(`apiHelper Error : Failed to PUT /api/v0/parkinglots/: \n \n ${err.message}`))
                        }
                        return resolve()
                    })
            })

        });
    });

    describe('/GET/:id parkinglots', () => {
        it('GET :id Controll Test checking that last two test actually worked', () => {
            return chai.request(server)
                .get('/api/v0/parkinglots/' + id)
                .set('x-access-token', adminToken)
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
    deleteAllUsers( () => {
        addUsers(() => {
            deleteAllParkingLogData(() => {
                deleteAllParkingLotData(callback);
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

// function authenticateUser() {
//     let admin = {
//         deviceId: "humbug",
//         name: "humbugName",
//         admin: true,
//         password: "pwd"
//     };
//
//     console.log("utenfor chaii request");
//     return chai.request(server)
//         .post('/api/v0/auth')
//         .send(admin)
//         .then((res) => {
//             console.log("inni chaii request");
//
//             res.should.have.status(200);
//             adminToken = res.body.token;
//             //console.log("res ", res);
//             console.log("adminToken", adminToken);
//         })
// }


function deleteAllParkingLogData(callback) {
    let query = "DELETE FROM parkingLog";
    connection.query(query, callback);
    console.log("deleteAllParkingLogsData");
    //callback();
}

function deleteAllParkingLotData(callback) {
    let query = "DELETE FROM parkingLot";
    connection.query(query, callback);
    console.log("deleteAllParkingLotData");
}

function messUpDatabase(callback) {

    function dropParkingLot(callback) {
        let query = "DROP TABLE parkingLot";
        connection.query(query, callback);
        console.log("dropParkingLot");
    }

    function dropParkingLog(callback) {
        let query = "DROP TABLE parkingLog";
        connection.query(query, callback);
        console.log("dropParkingLog");
    }
    dropParkingLog(dropParkingLot(callback));
}


function fixDatabase(callback) {

    function createParkingLotTable(callback) {
        let query = "CREATE TABLE parkingLot (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, ";
        query += "capacity int(11) NOT NULL, reservedSpaces int(11) NOT NULL,PRIMARY KEY (id)) ENGINE=InnoDB  DEFAULT CHARSET=utf8;";

        connection.query(query, callback);
        console.log("createParkingLotTable");
    }

    function createParkingLogTable(callback) {
        let query = "CREATE TABLE parkingLog (id int (11) NOT NULL AUTO_INCREMENT, currentParked int (11) NOT NULL,"
        query += "historicParkCount INT (11) NOT NULL, logDate datetime NOT NULL DEFAULT NOW(), parkingLot_id int NOT NULL,";
        query += "PRIMARY KEY (id), FOREIGN KEY fk_parkingLot(parkingLot_id) REFERENCES parkingLot(id) ) ENGINE=InnoDB;";
            connection.query(query, callback);
        console.log("createParkingLogTable");
    }

    createParkingLotTable(createParkingLogTable(callback));

}