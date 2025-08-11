
CREATE DATABASE IF NOT EXISTS orders;

USE orders;

CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY,
    client_tax_code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE order_product (
    order_id CHAR(36),
    product_code CHAR(36)
);

ALTER TABLE order_product
ADD CONSTRAINT pk_order_product
PRIMARY KEY (order_id, product_code);

ALTER TABLE order_product
ADD FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE;

DELIMITER %

CREATE PROCEDURE select_orders()
BEGIN
    SELECT *
    FROM orders
    ORDER BY orders.created_at DESC;
END%

CREATE PROCEDURE select_products ( order_id CHAR(36) )
BEGIN
    SELECT order_product.product_code
    FROM order_product
    JOIN orders ON orders.id = order_product.order_id
    WHERE order_product.order_id = order_id
    ORDER BY orders.created_at DESC;
END%

CREATE PROCEDURE select_order ( id CHAR(36) )
BEGIN
    SELECT *
    FROM orders
    WHERE orders.id = id
    ORDER BY orders.created_at DESC;
END%

CREATE PROCEDURE select_client_orders ( tax_code VARCHAR(255) )
BEGIN
    SELECT *
    FROM orders
    WHERE orders.client_tax_code = tax_code
    ORDER BY orders.created_at DESC;
END%

CREATE PROCEDURE select_order_product ( id CHAR(36) )
BEGIN
    SELECT order_product.product_code
    FROM order_product
    JOIN orders ON orders.id = order_product.order_id
    WHERE orders.id = id
    ORDER BY orders.created_at DESC;
END%

CREATE PROCEDURE insert_order ( client_tax_code VARCHAR(255) )
BEGIN
    INSERT INTO orders (id, client_tax_code, created_at, updated_at)
    VALUES (UUID(), client_tax_code, CURRENT_TIMESTAMP, NULL);
END%

CREATE PROCEDURE attach_product ( order_id CHAR(36), product_code CHAR(36) )
BEGIN
    INSERT INTO order_product ( order_id, product_code )
    VALUES (order_id, product_code);
END%

CREATE PROCEDURE delete_order ( id CHAR(36) )
BEGIN
    DELETE FROM orders
    WHERE orders.id = id;
END%

CREATE PROCEDURE delete_client_orders ( tax_code VARCHAR(255) )
BEGIN
    DELETE
    FROM orders
    WHERE orders.client_tax_code = tax_code;
END%

DELIMITER ;
