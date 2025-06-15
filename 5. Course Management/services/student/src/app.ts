import express from 'express';

import { studentRouter } from './routes';

const {
    APP_NAME = 'course-management-student',
    APP_BASE_URL = '/api/v1/student',
    APP_PORT = '80',
} = process.env;

const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.use(APP_BASE_URL, studentRouter);

application.listen(APP_PORT, () =>
    console.log(`${APP_NAME} listening on port ${APP_PORT}`)
);
