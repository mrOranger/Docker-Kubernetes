import express from 'express';

import { router } from './routes/v1/index.js';

const application = express();
const { PORT = 80, NAME = 'author' } = process.env;

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use('/api/v1/author', router);

application.listen(PORT, () =>
    console.log(`${NAME} listening on port ${PORT}`)
);
