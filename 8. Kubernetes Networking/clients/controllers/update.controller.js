import { pool } from '../database.js';

export async function update (request, response) {
    const { taxCode } = request.params;
    const { firstName, lastName } = request.body;

    const connection = await pool.getConnection();
    await connection.query(`CALL update_client(?, ?, ?)`, [ taxCode, firstName, lastName ]);
    connection.release();

    return response.status(200).json({ message: 'Client Updated Successfully!' });
};
