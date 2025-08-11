CREATE DATABASE IF NOT EXISTS clients;

USE clients;

CREATE TABLE clients (
    tax_code VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

DELIMITER %

CREATE PROCEDURE select_clients()
BEGIN
    SELECT *
    FROM clients
    ORDER BY clients.created_at DESC;
END%

CREATE PROCEDURE select_client(tax_code VARCHAR(255))
BEGIN
    SELECT * 
    FROM clients
    WHERE clients.tax_code = tax_code
    ORDER BY clients.created_at DESC;
END%

CREATE PROCEDURE insert_client (
    tax_code VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255)
)
BEGIN
    INSERT INTO clients (tax_code, first_name, last_name, created_at)
    VALUES (tax_code, first_name, last_name, CURRENT_TIMESTAMP);
END%

CREATE PROCEDURE update_client (
    tax_code VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255)
)
BEGIN
    UPDATE clients
    SET
        clients.first_name = first_name,
        clients.last_name = last_name,
        clients.updated_at = CURRENT_TIMESTAMP
    WHERE
        clients.tax_code = tax_code;
END%

CREATE PROCEDURE delete_client(tax_code VARCHAR(255))
BEGIN
    DELETE FROM clients
    WHERE clients.tax_code = tax_code;
END%

DELIMITER ;
