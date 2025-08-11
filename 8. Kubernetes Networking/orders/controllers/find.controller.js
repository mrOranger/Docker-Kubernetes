import { pool } from '../database.js';

export async function find (request, response) {
    const { id } = request.params;

    const connection = await pool.getConnection();
    const [ results ] = await connection.query(`CALL select_order(?)`, [ id ]);
    const [ rows ] = results;
    connection.release();

    return response.status(200).json({ data: rows });
};
