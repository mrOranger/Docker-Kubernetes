import { pool } from '../database.js';

export async function deleteClient ( request, response ) {
    const { taxCode } = request.params;

    const connection = await pool.getConnection();
    await connection.query(`CALL delete_client_orders(?)`, [ taxCode ]);
    connection.release();

    return response.status(200).json({ message: 'Orders Deleted Successfully!' });
}
