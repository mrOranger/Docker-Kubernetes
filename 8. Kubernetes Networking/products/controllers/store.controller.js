import { pool } from '../database.js';

export async function store(request, response) {
    const { name } = request.body;

    const connection = await pool.getConnection();
    await connection.query(`CALL insert_product(?)`, [name]);
    connection.release();

    return response
        .status(201)
        .json({ message: 'Product Stored Successfully!' });
}
