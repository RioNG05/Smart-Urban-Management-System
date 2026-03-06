Create database FlightBookingSystem;
go

use FlightBookingSystem;
go

DROP TABLE IF EXISTS Tickets;
DROP TABLE IF EXISTS Seats;
DROP TABLE IF EXISTS Flight;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS Aircrafts;
DROP TABLE IF EXISTS Routes;
DROP TABLE IF EXISTS Airlines;
DROP TABLE IF EXISTS Airports;
DROP TABLE IF EXISTS Customer;

CREATE TABLE Customer(
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    Fullname VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(50) NOT NULL,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL
);
GO

CREATE TABLE Airports(
    AirportID INT IDENTITY(1,1) PRIMARY KEY,
    AirportCode VARCHAR(20) NOT NULL,
    AirportName VARCHAR(50) NOT NULL,
    City VARCHAR(50) NOT NULL,
    Country VARCHAR(50) NOT NULL
);
GO

CREATE TABLE Airlines(
    AirlineID INT IDENTITY(1,1) PRIMARY KEY,
    AirlineCode VARCHAR(20) NOT NULL,
    AirlineName VARCHAR(50) NOT NULL,
    Country VARCHAR(50) NOT NULL
);
GO

CREATE TABLE Aircrafts(
    AircraftID INT IDENTITY(1,1) PRIMARY KEY,
    AirlineID INT NOT NULL,
    AircraftModel VARCHAR(50) NOT NULL,
    RegistrationNumber VARCHAR(50) NOT NULL,
    TotalSeats INT NOT NULL,
    EconomySeats INT NOT NULL,
    BusinessSeats INT NOT NULL,
    FirstClassSeats INT NOT NULL,
    CONSTRAINT fk_aircraft_airline 
        FOREIGN KEY (AirlineID) REFERENCES Airlines(AirlineID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION
);
GO

CREATE TABLE Routes(
    RouteID INT IDENTITY(1,1) PRIMARY KEY,
    DepartureAirportID INT NOT NULL,
    ArrivalAirportID INT NOT NULL,
    Distance INT NOT NULL,
    Duration INT NOT NULL,
    CONSTRAINT fk_route_departure 
        FOREIGN KEY (DepartureAirportID) REFERENCES Airports(AirportID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION,
    CONSTRAINT fk_route_arrival 
        FOREIGN KEY (ArrivalAirportID) REFERENCES Airports(AirportID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION
);
GO

CREATE TABLE Booking(
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    BookingReference VARCHAR(20) UNIQUE,
    BookingDate DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    TotalAmount DECIMAL(10,2) NOT NULL DEFAULT 0,
    Status VARCHAR(20) DEFAULT 'PENDING',
    CreateAt TIME(0) DEFAULT CAST(GETDATE() AS TIME(0)),
    CONSTRAINT fk_booking_customer 
        FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION
);
GO

CREATE TABLE Flight(
    FlightID INT IDENTITY(1,1) PRIMARY KEY,
    RouteID INT NOT NULL,
    AircraftID INT NOT NULL,
    FlightNumber VARCHAR(50) NOT NULL,
    DepartureTime DATETIME NOT NULL,
    ArrivalTime DATETIME NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    AvailableSeat INT NOT NULL,
    CONSTRAINT fk_flight_route 
        FOREIGN KEY (RouteID) REFERENCES Routes(RouteID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION,
    CONSTRAINT fk_flight_aircraft 
        FOREIGN KEY (AircraftID) REFERENCES Aircrafts(AircraftID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION
);
GO

CREATE TABLE Seats(
    SeatsID INT IDENTITY(1,1) PRIMARY KEY,
    FlightID INT NOT NULL,
    SeatNumber VARCHAR(50) NOT NULL,
    SeatClass VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_seat_flight 
        FOREIGN KEY (FlightID) REFERENCES Flight(FlightID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION
);
GO

CREATE TABLE Tickets(
    TicketID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    FlightID INT NOT NULL,
    SeatID INT NOT NULL,
    TicketNumber VARCHAR(50) NOT NULL,
    TicketClass VARCHAR(20) NOT NULL,
    Price DECIMAL(10,2) NOT NULL DEFAULT 0,
    Status VARCHAR(20) DEFAULT 'PENDING',
    CONSTRAINT fk_ticket_booking 
        FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION,
    CONSTRAINT fk_ticket_flight 
        FOREIGN KEY (FlightID) REFERENCES Flight(FlightID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION,
    CONSTRAINT fk_ticket_seat 
        FOREIGN KEY (SeatID) REFERENCES Seats(SeatsID)
        ON DELETE NO ACTION
ON UPDATE NO ACTION
);
GO

INSERT INTO Airports (AirportCode, AirportName, City, Country) VALUES
('HAN', 'Noi Bai International Airport', 'Hanoi', 'Vietnam'),
('SGN', 'Tan Son Nhat International Airport', 'Ho Chi Minh City', 'Vietnam'),
('DAD', 'Da Nang International Airport', 'Da Nang', 'Vietnam');

INSERT INTO Airlines (AirlineCode, AirlineName, Country) VALUES
('VN', 'Vietnam Airlines', 'Vietnam'),
('VJ', 'VietJet Air', 'Vietnam');

INSERT INTO Aircrafts 
(AirlineID, AircraftModel, RegistrationNumber, TotalSeats, EconomySeats, BusinessSeats, FirstClassSeats)
VALUES
(1, 'Airbus A321', 'VN-A321', 180, 150, 24, 6),
(2, 'Boeing 737', 'VJ-B737', 190, 170, 20, 0);

INSERT INTO Routes (DepartureAirportID, ArrivalAirportID, Distance, Duration) VALUES
(1, 2, 1150, 130), -- HAN -> SGN
(2, 3, 610, 85);   -- SGN -> DAD

INSERT INTO Customer (Fullname, Email, Phone, Username, Password) VALUES
('Nguyen Van A', 'vana@gmail.com', '0901234567', 'vana', '123456'),
('Tran Thi B', 'thib@gmail.com', '0912345678', 'thib', '123456');

INSERT INTO Booking (CustomerID, BookingReference, TotalAmount, Status) VALUES
(1, 'BK001', 2500000, 'CONFIRMED'),
(2, 'BK002', 1800000, 'PENDING');

INSERT INTO Flight 
(RouteID, AircraftID, FlightNumber, DepartureTime, ArrivalTime, Status, AvailableSeat)
VALUES
(1, 1, 'VN123', '2026-02-01 08:00:00', '2026-02-01 10:10:00', 'SCHEDULED', 180),
(2, 2, 'VJ456', '2026-02-02 14:00:00', '2026-02-02 15:25:00', 'SCHEDULED', 190);

INSERT INTO Seats (FlightID, SeatNumber, SeatClass, Price) VALUES
(1, '1A', 'Business', 3000000),
(1, '12C', 'Economy', 1500000),
(2, '3B', 'Business', 2500000),
(2, '20D', 'Economy', 1200000);

INSERT INTO Tickets
(BookingID, FlightID, SeatID, TicketNumber, TicketClass, Price, Status)
VALUES
(1, 1, 1, 'TICKET001', 'Business', 3000000, 'CONFIRMED'),
(1, 1, 2, 'TICKET002', 'Economy', 1500000, 'CONFIRMED'),
(2, 2, 4, 'TICKET003', 'Economy', 1200000, 'PENDING');

SELECT * FROM Customer;
SELECT * FROM Booking;
SELECT * FROM Flight;
SELECT * FROM Seats;
SELECT * FROM Tickets;


