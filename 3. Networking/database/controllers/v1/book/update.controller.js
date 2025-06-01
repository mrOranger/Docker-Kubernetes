import fs from 'fs';
import path from 'path';

import { Book } from '../../../models/v1/index.js';

export function update(request, response) {
    const { id } = request.params;
    const { title, year, authorId } = request.body;

    const folderPath = '/var/www/book';
    const filePath = path.join(folderPath, id);

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
            const book = new Book({ id, title, year, authorId });
            fs.writeFileSync(filePath, book.toString(), { flush: true });

            return response.status(200).json({ data: book });
        }

        return response.status(404).json({ message: 'Not found.' });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
