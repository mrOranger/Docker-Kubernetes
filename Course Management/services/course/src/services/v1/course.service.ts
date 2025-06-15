import { Observable } from 'rxjs';

import { Course } from '../../models/v1/course.model';
import { database } from '../../database/mysql.database';
import { CourseRepository } from 'services/course-repository.interface';

export class CourseService implements CourseRepository {
    public index(): Observable<Array<Course>> {
        return new Observable<Array<Course>>((subscriber) => {
            database
                .query<Array<Course>>(`CALL select_courses()`)
                .then(([rows, _]) => subscriber.next(rows))
                .catch(subscriber.error);
        });
    }

    public find(identifier: string): Observable<Course> {
        return new Observable<Course>((subscriber) => {
            database
                .query<Array<Course>>(`CALL select_course(?)`, [identifier])
                .then(([rows, _]) => subscriber.next(rows[0]))
                .catch(subscriber.error);
        });
    }
}
