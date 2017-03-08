/**
 * Created by archheretic on 03.02.17.
 */

process.env.NODE_ENV = "test";

let server = require('../src/server');
let connection = require("../src/dbconnection")
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
        it('This GET test should get an empty parkingLots object', () => {
            console.log("/GET parkinglots");
            return chai.request(server)
                .get('/api/v0/parkinglots/')
                .set('x-access-token', adminToken)
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
            };
            return chai.request(server)
                .post('/api/v0/parkinglots/')
                .set('x-access-token', adminToken)
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
            };
            return chai.request(server)
                .post('/api/v0/parkinglots/')
                .set('x-access-token', adminToken)
                .send(parkingLot)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.not.have.property('err');
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
                .expect(403)
                .expect((res) => {
                    expect(res.status).to.equal(403)
                    expect(res.forbidden).to.be.true
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
        it('it should fail to PUT/UPDATE a parking lot due to missing field', () => {
            parkingLot = {
                "id": id,
                "name": "newName",
                "capacity": 10,
            };
            return chai.request(server)
                .put('/api/v0/parkinglots/')
                .set('x-access-token', adminToken)
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
                .set('x-access-token', adminToken)
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
