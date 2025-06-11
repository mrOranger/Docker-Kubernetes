import { RequestHandler, Router } from 'express';

import { index } from '../../controllers';
import { students } from '../../middlewares';

const studentRouter = Router();

studentRouter.get('/', (students as RequestHandler), (index as RequestHandler));

export { studentRouter };
