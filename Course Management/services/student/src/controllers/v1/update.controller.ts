import Redis from 'ioredis';
import { Request, Response } from 'express';
import { concatMap, of, tap } from 'rxjs';

import { StudentService } from '../../services/v1/student.service';
import { Student } from 'models';

export function update(request: Request, response: Response) {
    const service = new StudentService();
    const { id } = request.params;
    const body = request.body as Student;

    const { CACHE_PORT = '6379', CACHE_HOST = 'cache' } = process.env;

    const redis = new Redis(parseInt(CACHE_PORT), CACHE_HOST);

    service
        .update(id, body)
        .pipe(
            concatMap((student) => of({ data: student })),
            tap(() => redis.del(`student-${id}`)),
            tap(() => redis.del(`students`))
        )
        .subscribe({
            next: (resource) => response.status(200).json(resource),
            error: (exception) =>
                response.status(500).json({ message: exception.toString() }),
        });
}
