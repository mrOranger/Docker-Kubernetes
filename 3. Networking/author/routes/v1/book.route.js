import { Router } from 'express';

import {
    find,
    index,
    remove,
    store,
    update,
} from '../../controllers/v1/index.js';

export const router = Router();

router.get('/', index);
router.get('/:taxCode', find);

router.post('/', store);

router.put('/:taxCode', update);

router.delete('/:taxCode', remove);
