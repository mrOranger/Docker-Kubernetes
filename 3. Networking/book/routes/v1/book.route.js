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
router.get('/:id', find);

router.post('/', store);

router.put('/:id', update);

router.delete('/:id', remove);
