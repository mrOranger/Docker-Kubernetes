CREATE DATABASE IF NOT EXISTS products;

USE products;

CREATE TABLE products (
    code CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

DELIMITER %

CREATE PROCEDURE select_products()
BEGIN
    SELECT products.*
    FROM products
    ORDER BY products.created_at DESC;
END%

CREATE PROCEDURE select_product ( code CHAR(36))
BEGIN
    SELECT products.*
    FROM products
    WHERE products.code = code;
END%

CREATE PROCEDURE insert_product (name VARCHAR(255))
BEGIN
    INSERT INTO products (code, name, created_at, updated_at)
    VALUES (UUID(), name, CURRENT_TIMESTAMP, NULL);
END%

CREATE PROCEDURE delete_product (code CHAR(36))
BEGIN
    DELETE FROM products
    WHERE products.code = code;
END%

DELIMITER ;
