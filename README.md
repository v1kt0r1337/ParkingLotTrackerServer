# ParkingLotTrackerServer
[![Build Status][travis-image]][travis-url] 
[![Coverage Status][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
Server application for the ParkingLotTracker project.

## Table of Contents

- [Installation](#installation)
- [How to run](#how-to-run)
- [API Overview](#api-overview)
- [API Documentation](#api-documentation)
- [Troubleshoot](#troubleshoot)
- [Tests](#tests)

## Installation

```sh
$ npm install
```

The database script is located at [scripts/database.sql](scripts/database.sql).

To change the database settings go to [config](config).
 - [config/default](config/default) is the production database.
 - [config/dev](config/dev) is the development database.
 - [config/test](config/test) is for the test database.

To enable additional settings modify [src/dbconnection.js](src/dbconnection.js).

To find out which options that are available look at:
- https://github.com/mysqljs/mysql#connection-options
- https://github.com/mysqljs/mysql#pool-options

## How to run

```sh
$ npm start
```
To change which environmental mode that is used (including database) modify the [package.json](package.json) start script.
If you have trouble starting the project look at 

## API Overview
API Endpoint | Method | Auth | Description
------------|---- |------- |-------------
auth |
/api/v0/auth | POST | no | Used to authenticate a user.
users |
/api/v0/users | GET | admin |  Gets All users
/api/v0/users/:id | GET | user | Gets a single user, auth token must belong to the user.
    /api/v0/users | POST | no | Creates a new user.
parkingLots |
/api/v0/parkinglots |GET | no | Gets all parkinglots
/api/v0/parkinglots/:id | no | Gets a Single parkinglot
/api/v0/parkinglots | POST | admin | Creates new parkinglot
/api/v0/parkinglots | PUT | admin | Updates a parkinglot
parkingLogs |
/api/v0/parkinglogs | GET | no | Gets all parkinglogs
/api/v0/parkinglogs/:id | GET | no | Gets a Single parkinglog
/api/v0/parkinglogs/:id | DELETE | no  | Deletes a single parkinglog
/api/v0/parkinglogs | POST | admin | Creates new parkinglog
/api/v0/parkinglogs/increment | POST | admin | Creates new parkinglog with one more OR less parked car then the former latest parkinglog.
/api/v0/parkinglogs | PUT | admin | Updates a parkinglog, only the currentParked value can be changed.
/api/v0/parkinglogs/latest | GET | no | Gets a single parkinglog of latest date.

## API Documentation


## Troubleshoot

If you have trouble starting the project try to run it by typing the command:
```sh
$ NODE_ENV=dev nodejs src/server.js"
```

## Tests

To run tests
```sh
$ npm test
```
This script uses the test database.

[travis-image]: https://travis-ci.org/Archheretic/ParkingLotTrackerServer.svg?branch=develop
[travis-url]: https://travis-ci.org/Archheretic/ParkingLotTrackerServer

[coveralls-image]: https://coveralls.io/repos/github/Archheretic/ParkingLotTrackerServer/badge.svg?branch=develop
[coveralls-url]: https://coveralls.io/github/Archheretic/ParkingLotTrackerServer?branch=develop

[snyk-image]: https://snyk.io/test/github/Archheretic/ParkingLotTrackerServer/develop/badge.svg
[snyk-url]: https://snyk.io/test/github/Archheretic/ParkingLotTrackerServer
