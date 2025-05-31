import fs from 'fs';
import path from 'path';

import { Book } from '../../models/v1/index.js';

export function remove(request, response) {
    const { id } = request.params;

    const folderPath = '/var/www/database/v1';

    if (!id) {
        return response.status(400).json({ message: 'Bad request.' });
    }

    try {
        const filePath = path.join(folderPath, id);
        const exists = fs.existsSync(filePath);

        if (!exists) {
            return response.status(404).json({ message: 'Not found.' });
        }

        const fileStatus = fs.statSync(filePath);

        if (fileStatus.isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const book = new Book(JSON.parse(fileContent));
            fs.rm(filePath);

            return response.status(200).json({ data: book });
        }

        return response.status(404).json({ message: 'Not found.' });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
