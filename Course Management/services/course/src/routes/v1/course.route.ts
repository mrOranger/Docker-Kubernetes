import { Router } from 'express';

import { index } from '../../controllers/v1/index.controller';
import { find } from '../../controllers/v1/find.controller';

import { course } from '../../middlewares/v1/course.middleware';
import { courses } from '../../middlewares/v1/courses.middleware';

const courseRoute = Router();

courseRoute.get('/', courses, index);
courseRoute.get('/:id', course, find);

export { courseRoute };
