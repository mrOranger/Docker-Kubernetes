import { pool } from '../database.js';

export async function remove(request, response) {
    const { code } = request.params;

    const connection = await pool.getConnection();
    await connection.query(`CALL delete_product(?)`, [code]);
    connection.release();

    return response
        .status(200)
        .json({ message: 'Product Deleted Successfully!' });
}
