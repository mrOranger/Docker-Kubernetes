import { Router } from 'express';

import { index } from '../../controllers/v1/index.controller';
import { find } from '../../controllers/v1/find.controller';

import { professor } from '../../middlewares/v1/professor.middleware';
import { professors } from '../../middlewares/v1/professors.middleware';

const professorRoutes = Router();

professorRoutes.get('/', professors, index);
professorRoutes.get('/:id', professor, find);

export { professorRoutes };
