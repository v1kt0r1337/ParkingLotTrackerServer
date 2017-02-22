# ParkingLotTrackerServer
[![Build Status][travis-image]][travis-url] 
[![Coverage Status][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
Server application for the ParkingLotTracker project.

## Table of Contents

- [Installation](#installation)
- [How to run](#how-to-run)
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

## API Documentation
API Endpoint | Description
------------ | -------------
parkingLots |
/api/v0/parkinglots | GET - All parkinglots
/api/v0/parkinglots/:id | GET - Single parkinglot
/api/v0/parkinglots | POST - Creates new parkinglot
/api/v0/parkinglots | PUT - Updates a parkinglot
parkingLogs |
/api/v0/parkinglogs | GET - All parkinglogs
/api/v0/parkinglogs/:id | GET/DELETE - Single parkinglog
/api/v0/parkinglogs | POST - Creates new parkinglog
/api/v0/parkinglogs | PUT - Updates a parkinglog, only the currentParked value can be changed.
/api/v0/parkinglogs/latest | GET - Single parkinglog of latest date.

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


[travis-image]: https://travis-ci.org/Archheretic/ParkingLotTrackerServer.svg?branch=snykIntegration
[travis-url]: https://travis-ci.org/Archheretic/ParkingLotTrackerServer

[coveralls-image]: https://coveralls.io/repos/github/Archheretic/ParkingLotTrackerServer/badge.svg?branch=snykIntegration
[coveralls-url]: https://coveralls.io/github/Archheretic/ParkingLotTrackerServer?branch=snykIntegration

[snyk-image]: https://snyk.io/test/github/Archheretic/ParkingLotTrackerServer/snykIntegration/badge.svg
[snyk-url]: https://snyk.io/test/github/Archheretic/ParkingLotTrackerServer
