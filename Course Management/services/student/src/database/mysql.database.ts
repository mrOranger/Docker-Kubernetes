import { createPool } from 'mysql2/promise';

const {
    DATABASE_HOST = 'students-database',
    DATABASE_PORT = '3306',
    DATABASE_USER = 'admin',
    DATABASE_PASSWORD = 'admin@@2025',
    DATABASE_NAME = 'course_management_students',
} = process.env;

export const database = createPool({
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});
