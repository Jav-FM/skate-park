-- Creación de base de datos
CREATE DATABASE skatepark;

-- Creación de tabla
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

-- Creación de administrador
INSERT INTO skaters 
(email, nombre, password, anos_experiencia, especialidad, foto, estado) 
VALUES ('admin@skaterpark.com', 'Administrador', '123123', '0', 'No aplica', 'No aplica', true)