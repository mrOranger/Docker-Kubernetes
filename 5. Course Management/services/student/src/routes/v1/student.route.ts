import { Router } from 'express';

import { student, students } from '../../middlewares';
import { index } from '../../controllers/v1/index.controller';
import { save } from '../../controllers/v1/save.controller';
import { find } from '../../controllers/v1/find.controller';
import { update } from '../../controllers/v1/update.controller';
import { destroy } from '../../controllers/v1/destroy.controller';

const studentRouter = Router();

studentRouter.get('/', students, index);
studentRouter.get('/:id', student, find);
studentRouter.post('/', save);
studentRouter.put('/:id', update);
studentRouter.delete('/:id', destroy);

export { studentRouter };
