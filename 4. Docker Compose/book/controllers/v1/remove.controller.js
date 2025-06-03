import fs from 'fs';
import path from 'path';

import { Book } from '../../models/v1/index.js';

export function remove(request, response) {
    const { id } = request.params;
    const { DATABASE_URL, DATABASE_PORT, DATABASE_BASE_PATH } = process.env;

    const PATH = `${DATABASE_URL}:${DATABASE_PORT}/${DATABASE_BASE_PATH}/${id}`;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    fetch(`${PATH}`, options)
        .then((response) => response.json())
        .then((result) => response.status(200).json(result))
        .catch((result) => response.status(500).json(result));
}
