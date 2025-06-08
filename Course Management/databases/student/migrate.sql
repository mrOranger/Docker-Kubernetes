CREATE DATABASE IF NOT EXISTS course_management_students;

USE course_management_students;

CREATE TABLE students (
    tax_code VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date TIMESTAMP,
    birth_place VARCHAR(50),
    gender BIT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE employers (
    id CHAR(36) PRIMARY KEY,
    business_name VARCHAR(50)
);

CREATE INDEX idx_business_name ON employers (id);

CREATE TABLE addresses (
    id CHAR(36) PRIMARY KEY,
    street VARCHAR(50) NOT NULL,
    street_code VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Italy'
);

ALTER TABLE students ADD address_id CHAR(36);

ALTER TABLE students
ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES addresses (id) ON DELETE CASCADE;

CREATE TABLE phones (
    id CHAR(36) PRIMARY KEY,
    contact_prefix VARCHAR(10) NOT NULL DEFAULT '+39',
    contact_number VARCHAR(50) NOT NULL UNIQUE,
    contact_type VARCHAR(50) NOT NULL DEFAULT 'Landline'
);

ALTER TABLE phones
ADD CHECK (
    contact_type IN ('Landline', 'Mobile')
);

ALTER TABLE students ADD phone_id CHAR(36);

ALTER TABLE students
ADD CONSTRAINT fk_phone_id FOREIGN KEY (phone_id) REFERENCES phones (id) ON DELETE SET NULL;

CREATE TABLE employees (
    tax_code CHAR(36) PRIMARY KEY,
    job_position VARCHAR(50) NOT NULL,
    grade VARCHAR(50) NOT NULL
);

ALTER TABLE employees
ADD CONSTRAINT fk_employee_tax_code FOREIGN KEY (tax_code) REFERENCES students (tax_code) ON DELETE CASCADE;

ALTER TABLE employees ADD employer_id CHAR(36);

ALTER TABLE employees
ADD constraint fk_employer_id FOREIGN KEY (employer_id) REFERENCES employers (id) ON DELETE CASCADE;

CREATE TABLE freelancers (
    tax_code CHAR(36) PRIMARY KEY,
    job_position VARCHAR(50) NOT NULL,
    professional_field VARCHAR(50) NOT NULL
);

ALTER TABLE freelancers
ADD CONSTRAINT fk_freelancer_tax_code FOREIGN KEY (tax_code) REFERENCES students (tax_code) ON DELETE CASCADE;

DELIMITER $

CREATE PROCEDURE select_students()
BEGIN
    SELECT * FROM students
        JOIN addresses ON students.address_id = addresses.id
        JOIN phones ON students.phone_id = phones.id;
END$

CREATE PROCEDURE select_employees()
BEGIN
    SELECT * FROM employees
        JOIN students ON students.tax_code = employees.tax_code
        JOIN addresses ON students.address_id = addresses.id
        JOIN phones ON students.phone_id = phones.id;
END$

CREATE PROCEDURE select_freelancers()
BEGIN
    SELECT * FROM freelancers
        JOIN students ON students.tax_code = freelancers.tax_code
        JOIN addresses ON students.address_id = addresses.id
        JOIN phones ON students.phone_id = phones.id;
END$

DELIMITER;
