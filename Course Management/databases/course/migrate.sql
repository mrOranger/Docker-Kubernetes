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

DELIMITER $

CREATE PROCEDURE select_courses ()
BEGIN
    SELECT * FROM courses;
END$

CREATE PROCEDURE select_course (IN course_code CHAR(36))
BEGIN
    SELECT * FROM courses
        WHERE courses.code = course_code;
END$

CREATE PROCEDURE select_professor_courses (IN professor_tax_code VARCHAR(50))
BEGIN
    SELECT courses.* FROM courses
        JOIN course_professor ON course_professor.course_code = coursed.code
        WHERE course_professor.professor_tax_code = professor_tax_code;
END$

CREATE PROCEDURE select_type_courses ( IN course_type VARCHAR(50) )
BEGIN
    SELECT courses.* FROM courses
        JOIN course_types ON courses_types.id = courses.course_type_id;
END$

CREATE PROCEDURE select_editions ()
BEGIN
    SELECT * FROM editions;
END$

CREATE PROCEDURE select_course_edition ( IN edition_code CHAR(36) )
BEGIN
    SELECT courses.* FROM courses
        JOIN editions ON editions.code = coursed.edition_code;
END$

CREATE PROCEDURE select_lesson_between ( IN starting_slot VARCHAR(50), IN ending_slot VARCHAR (50))
BEGIN
    SELECT lessons.* FROM lessons
        JOIN time_slots AS starting_time_slot ON lesson.starting_slot_id = time_slots.id
        JOIN time_slots AS ending_time_slot ON lessons.ending_slot_id = time_slots.id
        WHERE staring_time_slot.slot = starting_slot
            AND ending_time_slot.slot = ending_slot;
END$

CREATE PROCEDURE insert_course ( IN course_name VARCHAR (50), IN course_description VARCHAR(255))
BEGIN
    INSERT INTO courses (code, course_name, course_description, created_at, updated_at)
    VALUES (UUID(), course_name, course_description, CURRENT_TIMESTAMP(), NULL);
END$

CREATE PROCEDURE insert_course_type ( IN course_type VARCHAR(50) )
BEGIN
    INSERT INTO courses_types (id, courses_types, created_at, updated_at)
    VALUES (UUID(), courses_types, CURRENT_TIMESTAMP(), NULL);
END$

CREATE PROCEDURE insert_edition ( IN starting_date TIMESTAMP, ending_date TIMESTAMP )
BEGIN
    INSERT INTO editions(code, starting_date, ending_date, created_at, updated_at)
    VALUES (UUID(), starting_date, ending_date, CURRENT_TIMESTAMP(), NULL);
END$

CREATE PROCEDURE insert_lesson ( IN starting_slot_id CHAR(36), IN ending_slot_id CHAR(36) )
BEGIN
    INSERT INTO lessons (code, starting_slot_id, ending_slot_id, created_at, updated_at)
    VALUES (UUID(), starting_slot_id, ending_slot_id, CURRENT_TIMESTAMP(), NULL);
END$

CREATE PROCEDURE insert_time_slot (
    IN slot_name VARCHAR(50)
)
BEGIN
    INSERT INTO time_slots (id, slot)
    VALUES (UUID(), slot_name);
END$

CREATE PROCEDURE update_course (
    IN course_code CHAR(36),
    IN new_course_name VARCHAR (50),
    IN new_course_description VARCHAR(255)
)
BEGIN
    UPDATE courses
        SET course_name = new_course_name,
            course_description = new_course_description,
            updated_at = CURRENT_TIMESTAMP()
        WHERE code = course_code;
END$

CREATE PROCEDURE update_course_type ( IN course_type_id CHAR(36), IN new_course_type VARCHAR(50))
BEGIN
    UPDATE courses_types
        SET course_type=new_course_type,
            updated_at=CURRENT_TIMESTAMP()
        WHERE id=course_type_id;
END$

CREATE PROCEDURE update_edition (
    IN edition_code CHAR(36),
    IN new_starting_date TIMESTAMP,
    IN new_ending_date TIMESTAMP
)
BEGIN
    UPDATE editions
        SET
            starting_date = new_starting_date,
            ending_date = new_ending_date,
            updated_at = CURRENT_TIMESTAMP()
        WHERE
            code = edition_code;
END$

CREATE PROCEDURE update_lesson (
    IN lesson_code CHAR(36),
    IN new_starting_slot_id CHAR(36),
    IN new_ending_slot_id CHAR(36)
)
BEGIN
    UPDATE lessons
        SET
            starting_slot_id = new_starting_slot_id,
            ending_slot_id = new_ending_slot_id,
            updated_at = CURRENT_TIMESTAMP()
        WHERE
            code = lesson_code;
END$

CREATE PROCEDURE update_time_slot (
    IN slot_id CHAR(36),
    IN slot_name VARCHAR(50)
)
BEGIN
    UPDATE time_slots
        SET slot = slot_name
        WHERE id = slot_id;
END$

CREATE PROCEDURE delete_course ( IN course_code CHAR(36) )
BEGIN
    DELETE FROM courses WHERE code = course_code;
END$

CREATE PROCEDURE delete_edition ( IN edition_code CHAR(36) )
BEGIN
    DELETE FROM editions WHERE code = edition_code;
END$

CREATE PROCEDURE delete_lesson ( IN lesson_code CHAR(36) )
BEGIN
    DELETE FROM lessons WHERE code = lesson_code;
END$

DELIMITER ;
