import { pool } from '../database.js';

export async function store(request, response) {
    const { clientTaxCode } = request.body;

    const connection = await pool.getConnection();
    await connection.query(`CALL insert_order(?)`, [ clientTaxCode ]);
    connection.release();

    return response.status(201).json({ message: 'Order Created Successfully!' });
};
