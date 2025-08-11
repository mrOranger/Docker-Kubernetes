import { pool } from '../database.js';
import { FIND_CLIENT } from '../services/client.service.js';

export async function findClient (request, response) {
    const { taxCode } = request.params;

    const connection = await pool.getConnection();
    const [ results ] = await connection.query(`CALL select_client_orders(?)`, [ taxCode ]);
    const [ rows ] = results;
    connection.release();

    for (const row of rows) {
        const { client_tax_code } = row;
        const client = await FIND_CLIENT(client_tax_code);
        row.client = client;
    }

    return response.status(200).json({ data: rows });
};
