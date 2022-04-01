CREATE DATABASE skatepark;

CREATE TABLE skaters 
    (
        id SERIAL,
        email VARCHAR(250) NOT NULL UNIQUE,
        nombre VARCHAR(25) NOT NULL,
        password VARCHAR(250) NOT NULL,
        anos_experiencia INT NOT NULL,
        especialidad VARCHAR(50) NOT NULL,
        foto VARCHAR(255) NOT NULL,
        estado BOOLEAN NOT NULL
    );