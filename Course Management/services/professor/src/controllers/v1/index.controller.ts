import { concatMap, of, tap } from 'rxjs';
import { Request, Response } from 'express';

import { cache } from '../../database/redis.database';
import { ProfessorService } from '../../services/v1/professor.service';

export function index(request: Request, response: Response) {
    const service = new ProfessorService();

    service
        .index()
        .pipe(
            concatMap((students) => of({ data: students })),
            tap((resource) => cache.set('professors', JSON.stringify(resource)))
        )
        .subscribe({
            next: (resource) => response.status(200).json(resource),
            error: (exception) =>
                response.status(500).json({ message: exception.toString() }),
        });
}
