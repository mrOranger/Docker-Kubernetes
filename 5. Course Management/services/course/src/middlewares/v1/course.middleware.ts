import { NextFunction, Request, Response } from 'express';

import { cache } from '../../database/redis.database';

export function course(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { id } = request.params;

    cache
        .get(`course-${id}`)
        .then((result) => {
            if (result) {
                return response.json(JSON.parse(result));
            }
            next();
        })
        .catch(() => response.status(500).json({ message: 'Error.' }));
}
