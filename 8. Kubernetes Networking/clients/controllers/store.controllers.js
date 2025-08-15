import { pool } from '../database.js';

export async function store(request, response) {
    const { taxCode, firstName, lastName } = request.body;

    const connection = await pool.getConnection();
    await connection.query(`CALL insert_client(?, ?, ?)`, [
        taxCode,
        firstName,
        lastName,
    ]);
    connection.release();

    return response
        .status(200)
        .json({ message: 'Client Stored Successfully!' });
}
