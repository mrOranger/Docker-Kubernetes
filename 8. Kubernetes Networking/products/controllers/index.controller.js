import { pool } from '../database.js';

export async function index (_, response) {
    const connection = await pool.getConnection();
    const [ results ] = await connection.query(`CALL select_products()`);
    const [ rows ] = results;
    connection.release();

    return response.status(200).json({ data: rows });
};
