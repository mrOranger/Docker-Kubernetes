import fs from 'fs';
import path from 'path';

import { Author } from '../../../models/v1/index.js';

export function find(request, response) {
    const folderPath = '/var/www/author';
    const { taxCode } = request.params;

    if (!taxCode) {
        return response.status(400).json({ message: 'Bad request.' });
    }

    try {
        const filePath = path.join(folderPath, taxCode);
        const exists = fs.existsSync(filePath);

        if (!exists) {
            return response.status(404).json({ message: 'Not found.' });
        }

        const fileStatus = fs.statSync(filePath);

        if (fileStatus.isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const book = new Author(JSON.parse(fileContent));
            return response.status(200).json({ data: book });
        }

        return response.status(404).json({ message: 'Not found.' });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
