import fs from 'fs';
import path from 'path';

import { Author } from '../../models/v1/index.js';

export function remove(request, response) {
    const { taxCode } = request.params;

    const folderPath = '/var/www/database/v1';

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
            const author = new Author(JSON.parse(fileContent));
            fs.rm(filePath);

            return response.status(200).json({ data: author });
        }

        return response.status(404).json({ message: 'Not found.' });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
