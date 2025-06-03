import fs from 'fs';
import path from 'path';
import { v6 as uuid } from 'uuid';

import { Book } from '../../../models/v1/index.js';

export function store(request, response) {
    const folderPath = '/var/www/book';
    const { title, year, authorId } = request.body;

    const newBook = new Book({ id: uuid(), title, year, authorId });
    const filePath = path.join(folderPath, newBook.id);

    try {
        fs.writeFileSync(filePath, newBook.toString());

        return response.status(201).json({ data: newBook });
    } catch (exception) {
        console.error(exception);

        return response.status(500).json({ message: 'Error.' });
    }
}
