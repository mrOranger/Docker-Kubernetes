import { NextFunction, Request, Response } from "express";

import Redis from "ioredis";

export function students (request: Request, response: Response, next: NextFunction) {

    const { CACHE_PORT = '6379', CACHE_HOST = 'cache' } = process.env;

    const redis = new Redis(parseInt(CACHE_PORT), CACHE_HOST);

    next();
}
