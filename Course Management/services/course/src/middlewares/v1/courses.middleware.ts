import { NextFunction, Request, Response } from 'express';

import { cache } from '../../database/redis.database';

export function courses(
    request: Request,
    response: Response,
    next: NextFunction
) {
    cache
        .get('courses')
        .then((result) => {
            if (result) {
                return response.json(JSON.parse(result));
            }
            next();
        })
        .catch(() => response.status(500).json({ message: 'Error.' }));
}
