-- Active: 1710601348191@@127.0.0.1@5432@houses@public
CREATE DATABASE houses;

CREATE TABLE houses (
    id BIGSERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    num_rooms INT,
    has_garden BOOLEAN
);

