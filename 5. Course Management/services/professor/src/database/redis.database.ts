import Redis from 'ioredis';

const { CACHE_PORT = '6379', CACHE_HOST = 'cache' } = process.env;

export const cache = new Redis(parseInt(CACHE_PORT), CACHE_HOST);
