import database from 'mysql2/promise';

const {
    DATABASE_HOST = 'clients_database',
    DATABASE_PORT = 3306,
    DATABASE_USER = 'admin',
    DATABASE_PASSWORD = 'admin@@2025',
    DATABASE_NAME = 'clients',
} = process.env;

export const pool = database.createPool({
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


