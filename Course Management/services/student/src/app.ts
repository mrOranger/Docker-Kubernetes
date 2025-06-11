import express from 'express';
import { createConnection, QueryError } from 'mysql2';

import { studentRouter } from './routes';

const {
    APP_NAME = 'course-management-student',
    APP_BASE_URL = '/api/v1/student',
    APP_PORT = '80',
    DATABASE_HOST = 'students-database',
    DATABASE_PORT = '3306',
    DATABASE_USER = 'admin',
    DATABASE_PASSWORD = 'admin@@2025',
    DATABASE_NAME = 'course_management_students',
} = process.env;

const application = express();

const databaseConnection = createConnection({
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
});

databaseConnection.connect((exception: QueryError | null) => {

    if (exception) {
        console.error(exception.message);
        return;
    }

    application.use(express.json());
    application.use(express.urlencoded({ extended: true }));

    application.use(APP_BASE_URL, studentRouter);

    application.listen(APP_PORT, () => console.log(`${APP_NAME} listening on port ${APP_PORT}`));
});
