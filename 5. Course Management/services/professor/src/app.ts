import express from 'express';

import { professorRoutes } from './routes/v1/professor.route';

const {
    APP_NAME = 'course-management-professor-service',
    APP_BASE_URL = '/api/v1/professor',
    APP_PORT = '80',
} = process.env;

const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.use(APP_BASE_URL, professorRoutes);

application.listen(APP_PORT, () =>
    console.log(`${APP_NAME} listening on port ${APP_PORT}`)
);
