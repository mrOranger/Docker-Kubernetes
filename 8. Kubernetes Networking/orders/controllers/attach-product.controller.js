import { pool } from '../database.js';

export async function attachProduct (request, response) {
    const { orderId, productCode } = request.params;

    const connection = await pool.getConnection();
    await connection.query(`CALL attach_product(?, ?)`, [ orderId, productCode ]);
    connection.release();

    return response.status(201).json({ message: 'Order Updated Successfully!' });
};
