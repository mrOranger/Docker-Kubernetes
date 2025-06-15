import { concatMap, of, tap } from 'rxjs';
import { Request, Response } from 'express';

import { cache } from '../../database/redis.database';
import { CourseService } from '../../services/v1/course.service';

export function find(request: Request, response: Response) {
    const service = new CourseService();

    const { id } = request.params;

    service
        .find(id)
        .pipe(
            concatMap((student) => of({ data: student })),
            tap(() => cache.del(`course-${id}`)),
            tap(() => cache.del(`courses`))
        )
        .subscribe({
            next: (resource) => response.status(200).json(resource),
            error: (exception) =>
                response.status(500).json({ message: exception.toString() }),
        });
}
