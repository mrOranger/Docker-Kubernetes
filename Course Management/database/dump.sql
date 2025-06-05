CREATE DATABASE IF NOT EXISTS course_management;

USE course_management;

CREATE TABLE IF NOT EXISTS phones (
    id CHAR(36) PRIMARY KEY,
    contact_number VARCHAR(50) NOT NULL UNIQUE,
    contact_type VARCHAR(50) NOT NULL
);

ALTER TABLE phones ADD CHECK (contact_type = 'Landline' OR contact_type = 'Mobile');
CREATE INDEX idx_contact_number ON phones (contact_number);

CREATE TABLE professors (
    tax_code VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INTEGER,
    birth_place VARCHAR(50)
);

ALTER TABLE professors ADD CHECK (age >= 18);
CREATE INDEX idx_tax_code ON professors (tax_code);

ALTER TABLE phones ADD professor_id CHAR(36);
ALTER TABLE phones ADD CONSTRAINT fk_professor_id FOREIGN KEY (professor_id) REFERENCES professors(id);

CREATE TABLE courses IF NOT EXISTS (
    code CHAR(36) PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    course_description VARCHAR(255)
);

CREATE INDEX idx_course_name ON courses (course_name);

CREATE TABLE course_professor IF NOT EXISTS(
    course_code CHAR(36) NOT NULL,
    professor_tax_code VARCHAR(50) NOT NULL,
);

ALTER TABLE course_professor ADD UNIQUE (course_code, professor_tax_code);
ALTER TABLE course_professor ADD CONSTRAINT fk_course_code FOREIGN KEY (course_code) REFERENCES courses(code);
ALTER TABLE course_professor ADD CONSTRAINT fk_professor_tax_code FOREIGN KEY (professor_tax_code) REFERENCES professors(tax_code);

CREATE TABLE courses_types IF NOT EXISTS (
    id CHAR(36) PRIMARY KEY,
    course_type VARCHAR(50) NOT NULL
);

ALTER TABLE courses ADD course_type_id CHAR(36);
ALTER TABLE courses ADD CONSTRAINT fk_course_type_is FOREIGN KEY (course_type_id) REFERENCES courses_types(id);

CREATE TABLE editions IF NOT EXISTS (
    code CHAR(36) PRIMARY KEY,
    starting_date TIMESTAMP NOT NULL,
    ending_date TIMESTAMP,
);

ALTER TABLE editions ADD CHECK ((ending_date IS NULL) OR (ending_date > starting_date));
ALTER TABLE courses ADD edition_code CHAR(36);
ALTER TABLE courses ADD CONSTRAINT fk_edition_code FOREIGN KEY (edition_code) REFERENCES editions(code);

CREATE TABLE time_slots IF NOT EXISTS (
    id CHAR(36) PRIMARY KEY,
    slot VARCHAR(50) NOT NULL UNIQUE,
);

CREATE TABLE lessons IF NOT EXISTS (
    code char(36) PRIMARY KEY,
    starting_slot_id CHAR(36) NOT NULL,
    ending_slot_id CHAR(36),
);

ALTER TABLE ADD CHECK (starting_slot_id <> ending_slot_id);
ALTER TABLE lessons ADD CONSTRAINT fk_ending_slot_id FOREIGN KEY (ending_slot_id) REFERENCES time_slots(id);
ALTER TABLE lessons ADD CONSTRAINT fk_starting_slot_id FOREIGN KEY (starting_slot_id) REFERENCES time_slots(id);
