import { pool } from '../database.js';
import { DELETE_PRODUCT } from '../services/product.service.js';

export async function remove (request, response) {
    const { id } = request.params;

    const connection = await pool.getConnection();

    const [ results ] = await connection.query(`CALL select_products(?)`, [ id ]);
    const [ rows ] = results;

    for (const row of rows) {
        const { product_code } = row;
        await DELETE_PRODUCT(product_code);
    }

    await connection.query(`CALL delete_order(?)`, [ id ]);
    connection.release();

    return response.status(201).json({ message: 'Order Deleted Successfully!' });
}
