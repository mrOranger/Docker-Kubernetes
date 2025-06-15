import Redis from 'ioredis';
import { Request, Response } from 'express';
import { concatMap, of, tap } from 'rxjs';

import { Student } from 'models';
import { StudentService } from '../../services/v1/student.service';

export function save(request: Request, response: Response) {
    const service = new StudentService();
    const body = request.body as Student;

    const { CACHE_PORT = '6379', CACHE_HOST = 'cache' } = process.env;

    const redis = new Redis(parseInt(CACHE_PORT), CACHE_HOST);

    service
        .save(body)
        .pipe(
            concatMap((students) => of({ data: students })),
            tap(() => redis.del('students')),
            tap(() =>
                redis.set(`student-${body.tax_code}`, JSON.stringify(body))
            )
        )
        .subscribe({
            next: (resource) => response.status(200).json(resource),
            error: (exception) =>
                response.status(500).json({ message: exception.toString() }),
        });
}
