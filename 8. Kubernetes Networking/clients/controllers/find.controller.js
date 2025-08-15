import { pool } from '../database.js';

export async function find(request, response) {
    const { taxCode } = request.params;

    const connection = await pool.getConnection();
    const [results] = await connection.query(`CALL select_client(?)`, [
        taxCode,
    ]);
    const [rows] = results;
    connection.release();

    return response.status(200).json({ data: rows });
}
