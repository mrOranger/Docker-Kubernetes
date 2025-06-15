import { concatMap, of, tap } from 'rxjs';
import { Request, Response } from 'express';

import { cache } from '../../database/redis.database';
import { ProfessorService } from '../../services/v1/professor.service';

export function find(request: Request, response: Response) {
    const service = new ProfessorService();

    const { id } = request.params;

    console.log(id);

    service
        .find(id)
        .pipe(
            concatMap((student) => of({ data: student })),
            tap(() => cache.del(`professor-${id}`)),
            tap(() => cache.del(`professors`))
        )
        .subscribe({
            next: (resource) => response.status(200).json(resource),
            error: (exception) =>
                response.status(500).json({ message: exception.toString() }),
        });
}
