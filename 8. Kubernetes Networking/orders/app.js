import express from 'express';

import { index } from './controllers/index.controller.js';
import { find } from './controllers/find.controller.js';
import { findClient } from './controllers/find-client.controller.js';
import { deleteClient } from './controllers/delete-client.controller.js';
import { store } from './controllers/store.controller.js';
import { attachProduct } from './controllers/attach-product.controller.js';
import { remove } from './controllers/delete.controller.js';

const { APP_NAME, APP_PORT } = process.env;
const application = express();
const router = express.Router();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use('/order', router);

router.get('/', index);
router.get('/:id', find);
router.get('/client/:taxCode', findClient); 
router.post('/', store);
router.patch('/:orderId/product/:productCode', attachProduct);
router.delete('/client/:taxCode', deleteClient);
router.delete('/:id', remove);

application.listen(APP_PORT, () =>
    console.log(`${APP_NAME} listening on port ${APP_PORT}`)
);
