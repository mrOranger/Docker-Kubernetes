import { NextFunction, Request, Response } from 'express';

import Redis from 'ioredis';

export function student(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { CACHE_PORT = '6379', CACHE_HOST = 'cache' } = process.env;

    const redis = new Redis(parseInt(CACHE_PORT), CACHE_HOST);

    const { id } = request.params;

    redis
        .get(`student-${id}`)
        .then((result) => {
            if (result) {
                return response.json(JSON.parse(result));
            }
            next();
        })
        .catch(() => response.status(500).json({ message: 'Error.' }));
}
