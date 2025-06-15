import Redis from 'ioredis';
import { Request, Response } from 'express';
import { concatMap, of, tap } from 'rxjs';

import { StudentService } from '../../services/v1/student.service';

export function destroy(request: Request, response: Response) {
    const service = new StudentService();
    const { id } = request.params;

    const { CACHE_PORT = '6379', CACHE_HOST = 'cache' } = process.env;

    const redis = new Redis(parseInt(CACHE_PORT), CACHE_HOST);

    service
        .delete(id)
        .pipe(
            concatMap((student) => of({ data: { id } })),
            tap(() => redis.del(`student-${id}`)),
            tap(() => redis.del(`students`))
        )
        .subscribe({
            next: (resource) => response.status(200).json(resource),
            error: (exception) =>
                response.status(500).json({ message: exception.toString() }),
        });
}
