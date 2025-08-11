import express from 'express';

import { index } from './controllers/index.controller.js';
import { find } from './controllers/find.controller.js';
import { store } from './controllers/store.controller.js';
import { remove } from './controllers/delete.controller.js';

const { APP_NAME, APP_PORT } = process.env;
const application = express();
const router = express.Router();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use('/product', router);

router.get('/', index);
router.get('/:code', find);
router.post('/', store);
router.delete('/:code', remove);

application.listen(APP_PORT, () =>
    console.log(`${APP_NAME} listening on port ${APP_PORT}`)
);
