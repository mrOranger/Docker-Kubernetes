import fs from 'fs';
import path from 'path';

import { Author } from '../../../models/v1/index.js';

export function index(_, response) {
    const authors = [];
    const folderPath = '/var/www/author';

    try {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileStatus = fs.statSync(filePath);

            if (fileStatus.isFile()) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const book = new Author(JSON.parse(fileContent));

                authors.push(book);
            }
        }

        return response.status(200).json({ data: authors });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
