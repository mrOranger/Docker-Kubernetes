CREATE DATABASE IF NOT EXISTS course_management_professors;

USE course_management_professors;

CREATE TABLE phones (
    id CHAR(36) PRIMARY KEY,
    contact_prefix varchar(10) NOT NULL DEFAULT '+39',
    contact_number VARCHAR(20) NOT NULL UNIQUE,
    contact_type VARCHAR(20) NOT NULL DEFAULT 'Mobile'
);

ALTER TABLE phones
ADD CHECK (
    contact_type IN ('Landline', 'Mobile')
);

CREATE INDEX idx_contact_number ON phones (contact_number);

CREATE TABLE professors (
    tax_code VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date TIMESTAMP,
    birth_place VARCHAR(50),
    phone_id CHAR(36),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX idx_tax_code ON professors (tax_code);

ALTER TABLE professors
ADD CONSTRAINT fk_phone_id FOREIGN KEY (phone_id) REFERENCES phones (id) ON DELETE SET NULL;

DELIMITER $

CREATE PROCEDURE select_professors ()
BEGIN
    SELECT * FROM professors;
END$

CREATE PROCEDURE select_professors_with_phones()
BEGIN
    SELECT * FROM professors
    JOIN phones ON phones.id = professors.phone_id;
END$

CREATE PROCEDURE insert_professor_with_phone (
    IN tax_code VARCHAR(50),
    IN first_name VARCHAR(50),
    IN last_name VARCHAR(50),
    IN birth_date TIMESTAMP,
    IN birth_place VARCHAR(50),
    IN contact_number VARCHAR(20)
)
BEGIN
    DECLARE @phone_id CHAR(36);

    SET @phone_id = UUID();

    INSERT INTO phones (id, contact_number)
    VALUES (@phone_id, contact_number);

    INSERT INTO professors (tax_code, first_name, last_name, birth_date, birth_place, phone_id, created_at, updated_at)
    VALUES (tax_code, first_name, last_name, birth_date, birth_place, @phone_id, CURRENT_TIMESTAMP(), NULL);
END$

CREATE PROCEDURE update_professor_with_phone(
    IN professor_tax_code VARCHAR(50),
    IN new_first_name VARCHAR(50),
    IN new_last_name VARCHAR(50),
    IN new_birth_date TIMESTAMP,
    IN new_birth_place VARCHAR(50),
    IN new_contact_number VARCHAR(20)
)
BEGIN
    DECLARE professor_phone_id CHAR(36);

    UPDATE professors SET
        first_name = new_first_name,
        last_name = new_last_name,
        birth_date = new_birth_date,
        birth_place = new_birth_place,
        updated_at = CURRENT_TIMESTAMP()
    WHERE tax_code = professor_tax_code;

    SELECT phone_id INTO professor_phone_id FROM professors WHERE tax_code = professor_tax_code;

    UPDATE phones SET
        contact_number = new_contact_number
        WHERE id = professor_phone_id;

    DROP TEMPORARY TABLE professor_temp;
END$

CREATE PROCEDURE delete_professor( IN professor_tax_code VARCHAR(50) )
BEGIN
    DELETE FROM professors WHERE tax_code = professors_tax_code;
END$

DELIMITER ;
