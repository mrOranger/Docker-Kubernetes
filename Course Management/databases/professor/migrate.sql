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
