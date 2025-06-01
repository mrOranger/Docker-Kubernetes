import express from 'express';

import { bookRoutes, authorRoutes } from './routes/v1/index.js';

const application = express();
const { PORT = 80, NAME = 'database' } = process.env;

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use('/api/v1/database/book', bookRoutes);
application.use('/api/v1/database/author', authorRoutes);

application.listen(PORT, () =>
    console.log(`${NAME} listening on port ${PORT}`)
);
