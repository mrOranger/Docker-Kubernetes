import fs from 'fs';
import path from 'path';

import { Author } from '../../../models/v1/index.js';

export function store(request, response) {
    const { taxCode, firstName, lastName } = request.body;

    const folderPath = '/var/www/author';
    const filePath = path.join(folderPath, taxCode);

    const author = new Author({ taxCode, firstName, lastName });

    try {
        fs.writeFileSync(filePath, author.toString(), { mode: 0o644 });

        return response.status(201).json({ data: author });
    } catch (exception) {
        console.error(exception);

        return response.status(500).json({ message: 'Error.' });
    }
}
