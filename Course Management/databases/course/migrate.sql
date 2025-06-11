CREATE DATABASE IF NOT EXISTS course_management_courses;

USE course_management_courses;

CREATE TABLE courses (
    code CHAR(36) PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    course_description VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX idx_course_name ON courses (course_name);

CREATE TABLE course_professor (
    course_code CHAR(36) NOT NULL,
    professor_tax_code VARCHAR(50) NOT NULL
);

ALTER TABLE course_professor
ADD UNIQUE (
    course_code,
    professor_tax_code
);

ALTER TABLE course_professor
ADD CONSTRAINT fk_course_code FOREIGN KEY (course_code) REFERENCES courses (code) ON DELETE CASCADE;

CREATE TABLE courses_types (
    id CHAR(36) PRIMARY KEY,
    course_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

ALTER TABLE courses ADD course_type_id CHAR(36);

ALTER TABLE courses
ADD CONSTRAINT fk_course_type_is FOREIGN KEY (course_type_id) REFERENCES courses_types (id) ON DELETE SET NULL;

CREATE TABLE editions (
    code CHAR(36) PRIMARY KEY,
    starting_date TIMESTAMP NOT NULL,
    ending_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

ALTER TABLE editions
ADD CHECK (
    (ending_date IS NULL)
    OR (ending_date > starting_date)
);

ALTER TABLE courses ADD edition_code CHAR(36);

ALTER TABLE courses
ADD CONSTRAINT fk_edition_code FOREIGN KEY (edition_code) REFERENCES editions (code) ON DELETE CASCADE;

CREATE TABLE time_slots (
    id CHAR(36) PRIMARY KEY,
    slot VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE lessons (
    code CHAR(36) PRIMARY KEY,
    starting_slot_id CHAR(36),
    ending_slot_id CHAR(36),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

ALTER TABLE lessons
ADD CONSTRAINT fk_ending_slot_id FOREIGN KEY (ending_slot_id) REFERENCES time_slots (id) ON DELETE SET NULL;

ALTER TABLE lessons
ADD CONSTRAINT fk_starting_slot_id FOREIGN KEY (starting_slot_id) REFERENCES time_slots (id) ON DELETE SET NULL;
