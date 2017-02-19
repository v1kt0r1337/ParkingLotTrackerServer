# ParkingLotTrackerServer
Server application for the ParkingLotTracker project

API Endpoint | Description
------------ | -------------
parkingLots
/api/v0/parkinglots | GET - All parkinglots
/api/v0/parkinglots/:id | GET - Single parkinglot
/api/v0/parkinglots | POST - Creates new parkinglot
/api/v0/parkinglots | PUT - Updates a parkinglot
parkingLogs
/api/v0/parkinglogs | GET - All parkinglogs
/api/v0/parkinglogs/:id | GET/DELETE - Single parkinglog
/api/v0/parkinglogs | POST - Creates new parkinglog
/api/v0/parkinglogs | PUT - Updates a parkinglog, only the currentParked value can be changed.
/api/v0/parkinglogs/latest | GET - Single parkinglog of latest date.
