import express from 'express';

import { index } from './controllers/index.controller.js';
import { find } from './controllers/find.controller.js';
import { store } from './controllers/store.controllers.js';
import { update } from './controllers/update.controller.js';
import { remove } from './controllers/delete.controller.js';

const { APP_NAME, APP_PORT } = process.env;

const router = express.Router();
const application = express();

application.use(express.json());
application.use('/client', router);
application.use(express.urlencoded({ extended: true }));

router.get('/', index);
router.get('/:taxCode', find);
router.post('/', store);
router.put('/:taxCode', update);
router.delete('/:taxCode', remove);

application.listen(APP_PORT, () =>
    console.log(`${APP_NAME} listening on port ${APP_PORT}`)
);
