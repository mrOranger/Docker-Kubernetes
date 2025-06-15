import express from 'express';

import { courseRoute } from './routes/v1/course.route';

const {
    APP_NAME = 'course-management-course-service',
    APP_BASE_URL = '/api/v1/course',
    APP_PORT = '80',
} = process.env;

const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.use(APP_BASE_URL, courseRoute);

application.listen(APP_PORT, () =>
    console.log(`${APP_NAME} listening on port ${APP_PORT}`)
);
