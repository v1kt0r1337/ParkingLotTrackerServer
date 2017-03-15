DROP SCHEMA IF EXISTS shitdatabasetest;

CREATE SCHEMA IF NOT EXISTS shitdatabasetest;
use shitdatabasetest;
CREATE TABLE parkingLot (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  #location varchar(50),
  capacity int(11) NOT NULL,
  reservedSpaces int(11) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8; 

CREATE TABLE parkingLog (
  id int (11) NOT NULL AUTO_INCREMENT,
  currentParked int (11) NOT NULL,
  historicParkCount INT (11) NOT NULL,
  logDate datetime NOT NULL DEFAULT NOW(),
  parkingLot_id int NOT NULL,
  #CONSTRAINT constraint_name
  PRIMARY KEY (id),
  FOREIGN KEY fk_parkingLot(parkingLot_id)
  REFERENCES parkingLot(id)
) ENGINE=InnoDB;

CREATE TABLE user (
  deviceId VARCHAR (64) NOT NULL,
  name VARCHAR (32) NOT NULL,
  admin BOOLEAN NOT NULL,
  salt VARCHAR (64) NOT NULL,
  password VARCHAR (64) NOT NULL
) ENGINE=InnoDB;

use shitdatabasetest
INSERT INTO parkingLot (name, capacity, reservedSpaces) VALUES
('Student Organisasjonen', 100, 10),
('Hokus Pokus Barnehage', 70, 7);

use shitdatabasetest;
INSERT INTO parkingLog (currentParked, historicParkCount, logDate, parkingLot_id) VALUES
(28, 1337, '2016-12-31 10:59:59', 1),
(29, 1338, '2017-01-30 11:53:54', 1),
(30, 1339, NOW(), 1),
(18, 600, '2016-12-31 10:59:59', 2),
(19, 601, '2017-01-30 11:53:54', 2),
(18, 601, NOW(), 2);

