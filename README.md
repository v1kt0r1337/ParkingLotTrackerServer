# ParkingLotTrackerServer
[![Github Version][version-image]][version-url]
[![Build Status][travis-image]][travis-url] 
[![Coverage Status][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

Server application for the ParkingLotTracker project.

### Related projects
Raspberry Pi Parking Lot Tracker: https://github.com/Archheretic/ParkingLotTracker

Mobile app: https://github.com/Archheretic/ParkingLotTrackerMobileApp


## Table of Contents

- [Installation](#installation)
- [How to run](#how-to-run)
- [API Overview](#api-overview)
- [API Documentation](#api-documentation)
    - [Authenticate user](#authenticate-user)
    - [GET all users](#get-all-users)
    - [GET a user](#get-a-user)
    - [POST new user](#post-new-user)
    - [GET all parkinglots](#get-all-parkinglots)
    - [GET a parkinglot](#get-a-parkinglot)
    - [POST new parkinglot](#post-new-parkinglot)
    - [PUT parkinglot](#put-parkinglot)
    - [GET all parkinglogs](#get-all-parkinglogs)
    - [GET a parkinglog](#get-a-parkinglog)
    - [DELETE a parkinglog](#delete-a-parkinglog)
    - [POST new parkinglog](#post-new-parkinglog)
    - [Increment parkinglog](#increment-parkinglog)
    - [PUT parkinglog](#put-parkinglog)
    - [GET latest registered parkinglog](#get-latest-registered-parkinglog)
    - [GET a parkinglots latest registered parkinglog](#get-a-parkinglots-latest-registered-parkinglog)
- [Troubleshoot](#troubleshoot)
- [Tests](#tests)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)


## Installation

```sh
$ npm install
```

The database script is located at [scripts/database.sql](scripts/database.sql).

To change the database settings go to [config](config).
 - [config/default.json](config/default.json) is the production database.
 - [config/dev.json](config/dev) is the development database.
 - [config/test.json](config/test) is for the test database.

To enable additional settings modify [src/dbconnection.js](src/dbconnection.js).

To find out which options that are available look at:
- https://github.com/mysqljs/mysql#connection-options
- https://github.com/mysqljs/mysql#pool-options

## How to run
To start on systems that uses node
```sh
$ npm start
```
To start on systems that uses nodejs
```sh
$ npm run nodejs
```
To change which environmental mode that is used (including database) modify the [package.json](package.json) start script.
If you have trouble starting the project look at 

## API Overview
API Endpoint | Method | Auth | Description
------------|---- |------- |-------------
auth |
/api/v0/auth | POST | no | Used to authenticate a user.
users |
/api/v0/users | GET | admin |  Gets all users
/api/v0/users/:id | GET | user | Gets a single user, auth token must belong to the user.
/api/v0/users | POST | no | Creates a new user.
parkingLots |
/api/v0/parkinglots |GET | no | Gets all parkinglots
/api/v0/parkinglots/:id | GET | no | Gets a Single parkinglot
/api/v0/parkinglots | POST | admin | Creates new parkinglot
/api/v0/parkinglots | PUT | admin | Updates a parkinglot
parkingLogs |
/api/v0/parkinglogs | GET | no | Gets all parkinglogs
/api/v0/parkinglogs/:id | GET | no | Gets a Single parkinglog
/api/v0/parkinglogs/:id | DELETE | no  | Deletes a single parkinglog
/api/v0/parkinglogs | POST | admin | Creates new parkinglog
/api/v0/parkinglogs/increment | POST | admin | Creates a new parkinglog with one more OR less parked car then the former latest parkinglog.
/api/v0/parkinglogs | PUT | admin | Updates a parkinglog, only the currentParked value can be changed.
/api/v0/parkinglogs/latest | GET | no | Gets a single parkinglog of latest date.
/api/v0/parkinglogs/latest/:id | GET | no | Gets latest registered parkinglog of a specific parkinglot.

## API Documentation

### Authenticate user

  Authenticates a user, if user credentials match whats in the database.

* **URL**

  /api/v0/auth

* **Method:**

  `POST`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  None

* **Data Params**

  `{"deviceId":"f07a13984f6d116a","password":"pwd"}`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success":true,"message":"Enjoy your token!"
    ,"token":"eyJhbGciOiJIUzI1NiIhdhahadCI6IkpXVCJ5...}`
    
* **Error Response:**

  * **Code:** 401 <br />  
    **Content:** `{"success":false,"message":"Reason for failure."}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
 
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/auth",
      dataType: "json",
      type : "POST",
      Data: '{"deviceId":"f07a13984f6d116a","password":"pwd"}',
      success : function(r) {
        console.log(r);
      }
    });
  ```  

### GET all users

  Returns the all users in json data format.

* **URL**

  /api/v0/users

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** adminToken

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"users":[{"deviceId":"f07a13984f6d116a","name":"Ole","admin":0,"password":"pwd"}
                  ,{"deviceId":"fa912c713f6d932a","name":"Dole","admin":1,"password":"pwd"}]}`
    
* **Error Response:**
  
  * **Code:** 401 <br />
  **Content:** `{"success":false, "message":"The reason for failure"}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`  
 
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/users",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
### GET a user

  Gets a single user, auth token must belong to the user.

* **URL**

  /api/v0/users/:id

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** userToken

*  **URL Params**

  id=[string]

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"users":[{"deviceId":"f07a13984f6d116a","name":"Ole","admin":0,"password":"pwd"}]}`
    
* **Error Response:**
  
  * **Code:** 401 <br />
  **Content:** `{"success":false, "message":"The reason for failure"}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
     
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/users/f07a13984f6d116a",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### POST new user

  Creates a new user

* **URL**

  /api/v0/users

* **Method:**

  `POST`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  None

* **Data Params**

  `{"deviceId":"f07a13984f6d116a","name":"Ole","password":"pwd"}`

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{"Message" : "User Added"}`
    
* **Error Response:**
  
  * **Code:** 401 <br />
  **Content:** `{"success":false,"message":"Failed to authenticate token."}`
                OR
               `{"success":false,"message":"No token provided."}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
     
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/users",
      dataType: "json",
      type : "POST",
      Data: '{"deviceId":"f07a13984f6d116a","name":"Ole","password":"pwd"}',
      success : function(r) {
        console.log(r);
      }
    });
  ```


### GET all parkinglots

  Returns the all parkinglots

* **URL**

  /api/v0/parkinglots

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"parkingLots":[{"id":1,"name":"Student Organisasjonen","capacity":100,"reservedSpaces":10,"lat":58.1634301,"lng":8.0063132}
                                 ,{"id":2,"name":"Hokus Pokus Barnehage","capacity":70,"reservedSpaces":7,"lat":58.1644578,"lng":8.0005553}]}`
    
* **Error Response:**
  
  * **Code:** 204 <br />
    **Content:** `{"success": false, "message": "No parking lots found"}`
    
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`    
 
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglots",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### GET a parkinglot

  Gets a single parkinglot.

* **URL**

  /api/v0/parkinglots/:id

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  id=[integer]

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"parkingLots":[{"id":1,"name":"Student Organisasjonen","capacity":100,"reservedSpaces":10,"lat":58.1634301,"lng":8.0063132}]}`
    
* **Error Response:**
    
    * **Code:** 204 <br />
      **Content:** `{"success": false, "message": "Parking lot not found"}`
      
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`      
  
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglots/1",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### POST new parkinglot

  Creates a new parkinglots

* **URL**

  /api/v0/parkinglots

* **Method:**

  `POST`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** adminToken

*  **URL Params**

  None

* **Data Params**

  `{"name":"Student Organisasjonen","capacity":100,"reservedSpaces":10,"lat":58.1634301,"lng":8.0063132}`

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{"Message":"Parking Lot Added"}`
    
* **Error Response:**

  * **Code:** 400 <br /> 
    **Content:** `{"success":false, "The parking lots id in the request body is not defined"}`
  
  * **Code:** 401 <br />
  **Content:** `{"success":false, "message":"The reason for failure"}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
     
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglots",
      dataType: "json",
      type : "POST",
      Data: '{"name":"Student Organisasjonen","capacity":100,"reservedSpaces":10,"lat":58.1634301,"lng":8.0063132}',
      success : function(r) {
        console.log(r);
      }
    });
  ```

### PUT parkinglot

  Updates an existing parkinglot

* **URL**

  /api/v0/parkinglots

* **Method:**

  `PUT`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** adminToken

*  **URL Params**

  None

* **Data Params**

  `{"id":1,"name":"Student Organisasjonen","capacity":100,"reservedSpaces":20,"lat":58.1634301,"lng":9.0063132}`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"Message":"Parking Lot Updated"}`
    
* **Error Response:**

  * **Code:** 400 <br />
    **Content:** `{"success":false, "The parking lots id in the request body is not defined"}`
  
  * **Code:** 401 <br />
    **Content:** `{"success":false, "message":"The reason for failure"}`
  
  * **Code:** 204 <br />
    **Content:** `{"success": false, "message": "Parking log not found"}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}` 
    
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglots",
      dataType: "json",
      type : "PUT",
      Data: '{"id":1,"name":"Student Organisasjonen","capacity":100,"reservedSpaces":20,"lat":58.1634301,"lng":9.0063132}',
      success : function(r) {
        console.log(r);
      }
    });
  ```

### GET all parkinglogs

  Returns the all parkinglogs

* **URL**

  /api/v0/parkinglogs

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"parkingLogs":[{"id":1,"currentParked":28,"historicParkCount":1337,"logDate":"2016-12-31T09:59:59.000Z","parkingLot_id":1}
                 ,{"id":2,"currentParked":29,"historicParkCount":1338,"logDate":"2017-01-30T10:53:54.000Z","parkingLot_id":1}]}`
    
* **Error Response:**
  
  * **Code:** 204 <br />
    **Content:** `{"success": false, "message": "No parking logs found"}`
    
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
     
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkingLogs",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### GET a parkinglog

  Gets a single parkinglog.

* **URL**

  /api/v0/parkinglogs/:id

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  id=[integer]

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"parkingLogs":[{"id":1,"currentParked":28,"historicParkCount":1337,"logDate":"2016-12-31T09:59:59.000Z","parkingLot_id":1}]}`
    
* **Error Response:**
  
  * **Code:** 204 <br />
    **Content:** `{"success": false, "message": "Parking log not found"}`
      
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
  
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs/1",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### DELETE a parkinglog

  Deletes a parkinglog.

* **URL**

  /api/v0/parkinglogs/:id

* **Method:**

  `DELETE`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  id=[integer]

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"Message":"Deleted parking log with id 1"}`
    
* **Error Response:**
  
   * **Code:** 204 <br />
     **Content:** `{"success": false, "message": "Parking log not found"}`
       
   * **Code:** 500 <br />  
     **Content:** `{"success":false,"message":"Internal Server Error."}`
        
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs/1",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### POST new parkinglog

  Creates a new parkinglog

* **URL**

  /api/v0/parkinglogs

* **Method:**

  `POST`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** adminToken

*  **URL Params**

  None

* **Data Params**
  `{"currentParked":10,"parkingLot_id":1}`

* **Success Response:**

  * **Code:** 201 <br />
    
* **Error Response:**

  * **Code:** 400 <br />
    **Content:** `{"success":false, "message":"request body is missing parkingLot_id}`
  
  * **Code:** 401 <br />
  **Content:** `{"success":false, "message":"The reason for failure"}`
  
  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
     
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs",
      dataType: "json",
      type : "POST",
      Data: '{"currentParked":10,"parkingLot_id":1}',
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
### Increment parkinglog

  Creates a new parkinglog with one more OR less parked car then the former latest parkinglog of that specific parkinglot

* **URL**

  /api/v0/parkinglogs/increment

* **Method:**

  `POST`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** adminToken

*  **URL Params**

  None

* **Data Params**
    examples:
  `{"increment":1,"parkingLot_id":1}`
  `{"increment":5,"parkingLot_id":1}`
  `{"increment":-1,"parkingLot_id":1}`

* **Success Response:**

  * **Code:** 201 <br />
    
* **Error Response:**
  
  * **Code:** 400 <br />
    **Content:** `{"success":false, "message":"request body is missing parkingLot_id}`
  
  * **Code:** 401 <br />
  **Content:** `{"success":false, "message":"The reason for failure"}`

  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
      
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs/increment",
      dataType: "json",
      type : "POST",
      Data: '{"increment":1,"parkingLot_id":1}',
      success : function(r) {
        console.log(r);
      }
    });
  ```

### PUT parkinglog

  Updates an existing parkinglog

* **URL**

  /api/v0/parkinglogs

* **Method:**

  `PUT`

* **Headers:**

    * **Content-Type** application/json
    * **x-access-token** adminToken

*  **URL Params**

  None

* **Data Params**

  `{"id":29,"currentParked":10,"parkingLot_id":1}`

* **Success Response:**

  * **Code:** 200 <br />
    
* **Error Response:**
  
    * **Code:** 400 <br />
      **Content:** `{"success":false, "message":"request body is missing id and/or currentParked"}`
      
    * **Code:** 401 <br />
      **Content:** `{"success":false, "message":"The reason for failure"}`
  
    * **Code:** 204 <br />
      **Content:** `{"success": false, "message": "Parking log not found"}`
    
    * **Code:** 500 <br />  
      **Content:** `{"success":false,"message":"Internal Server Error."}`    
 
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs",
      dataType: "json",
      type : "PUT",
      Data: '{"id":29,"currentParked":10,"parkingLot_id":1}',
      success : function(r) {
        console.log(r);
      }
    });
  ```

### GET latest registered parkinglog

  Gets latest registered parkinglog regardless of parkinglot.

* **URL**

  /api/v0/parkinglogs/latest

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"parkingLogs":[{"id":1,"currentParked":28,"historicParkCount":1337,"logDate":"2016-12-31T09:59:59.000Z","parkingLot_id":1}]}`
    
* **Error Response:**
  
  * **Code:** 204 <br />
    **Content:** `{"success": false, "message": "Parking log not found"}`  

  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
      
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs/latest",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

### GET a parkinglots latest registered parkinglog

  Gets latest registered parkinglog of a specific parkinglot.

* **URL**

  /api/v0/parkinglogs/latest/:id

* **Method:**

  `GET`

* **Headers:**

    * **Content-Type** application/json

*  **URL Params**

  id=[integer]

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"parkingLogs":[{"id":1,"currentParked":28,"historicParkCount":1337,"logDate":"2016-12-31T09:59:59.000Z","parkingLot_id":1}]}`
    
* **Error Response:**

  * **Code:** 204 <br />
    **Content:** `{"success": false, "message": "Parking log not found"}`  

  * **Code:** 500 <br />  
    **Content:** `{"success":false,"message":"Internal Server Error."}`
      
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/v0/parkinglogs/latest/1",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

## Troubleshoot

If you have trouble starting the project try to run it by typing the command:
```sh
$ NODE_ENV=dev nodejs src/server.js"
```

## Tests

If adding new test files, make certain that the file serverErrorPaths.test.js is the last test file to run.
This test file will drop the test database, so this database needs to be regenerated.

To run tests
```sh
$ npm test
```

Warning, both these scripts will end up dropping the test database, the test database need to be regenerated or 
the next tests will fail.
To avoid this, comment out the code in serverErrorPaths.test.js. HOWEVER! Be sure the uncomment this code before next
git commit.

To run the complete test suite
```sh
$ npm run coveralls
```

These script uses the test database.

## Contributing
 
This project welcomes contributions from the community. Contributions are
accepted using GitHub pull requests. If you're not familiar with making
GitHub pull requests, please refer to the
[GitHub documentation "Creating a pull request"](https://help.github.com/articles/creating-a-pull-request/).
 
For a good pull request, we ask you provide the following:
 
1. Try to include a clear description of your pull request in the description.
   It should include the basic "what" and "why"s for the request.
2. The tests should pass as best as you can. See the [Running tests](#running-tests)
   section on hwo to run the different tests. GitHub will automatically run
   the tests as well (soon to be implemented), to act as a safety net.
3. The pull request should include tests for the change. A new feature should
   have tests for the new feature and bug fixes should include a test that fails
   without the corresponding code change and passes after they are applied.
4. If the pull request is a new feature, please be sure to include all
   appropriate documentation additions in the `Readme.md` file as well.
 
## Versioning
 
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Archheretic/ParkingLotTrackerMobileApp/tags).


[version-image]: https://badge.fury.io/gh/Archheretic%2FParkingLotTrackerServer.svg
[version-url]: https://badge.fury.io/gh/Archheretic%2FParkingLotTrackerServer

[travis-image]: https://travis-ci.org/Archheretic/ParkingLotTrackerServer.svg?branch=hotfix-0.8.1
[travis-url]: https://travis-ci.org/Archheretic/ParkingLotTrackerServer

[coveralls-image]: https://coveralls.io/repos/github/Archheretic/ParkingLotTrackerServer/badge.svg?branch=hotfix-0.8.1
[coveralls-url]: https://coveralls.io/github/Archheretic/ParkingLotTrackerServer?branch=hotfix-0.8.1

[snyk-image]: https://snyk.io/test/github/Archheretic/ParkingLotTrackerServer/badge.svg
[snyk-url]: https://snyk.io/test/github/Archheretic/ParkingLotTrackerServer