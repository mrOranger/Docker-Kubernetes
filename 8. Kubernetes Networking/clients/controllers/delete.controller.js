import { pool } from '../database.js';
import { DELETE_CLIENT_ORDERS } from '../services/order.service.js';

export async function remove(request, response) {
    const { taxCode } = request.params;

    const connection = await pool.getConnection();
    await connection.query(`CALL delete_client(?)`, [taxCode]);
    connection.release();

    await DELETE_CLIENT_ORDERS(taxCode);

    return response
        .status(200)
        .json({ message: 'Client Deleted Successfully!' });
}
