import fs from 'fs';
import path from 'path';

import { Book } from '../../models/v1/index.js';

export function index(_, response) {
    const books = [];
    const folderPath = '/var/www/database/v1';

    try {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileStatus = fs.statSync(filePath);

            if (fileStatus.isFile()) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const book = new Book(JSON.parse(fileContent));

                books.push(book);
            }
        }

        return response.status(200).json({ data: books });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
