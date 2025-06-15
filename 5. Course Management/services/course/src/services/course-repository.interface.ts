import { Course } from 'models';

import { CRUDRepository } from './crud-repository.interface';

export interface CourseRepository
    extends CRUDRepository<Course, Course['code']> {}
