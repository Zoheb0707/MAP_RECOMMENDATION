/**
    Author: Zoheb0707
    Created: 06/19/2019
*/

/* setting up database */
CREATE DATABASE maps;
USE maps;

-- creating users table
CREATE TABLE users(
    user_id varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    PRIMARY KEY(user_id)
);

/* creating table restaurants */
CREATE TABLE restaurants(
    restaurant_id varchar(20) NOT NULL,
    name varchar(40) NOT NULL,
    type varchar(20),
    location varchar(100) NOT NULL,
    PRIMARY KEY(restaurant_id)
);

/* creating table visits */
CREATE TABLE visits(
    restaurant_id varchar(20) NOT NULL,
    user_id varchar(20) NOT NULL,
    times int NOT NULL,
    avg_rating float NOT NULL,
    PRIMARY KEY(restaurant_id, user_id)
);
