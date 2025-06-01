import fs from 'fs';
import path from 'path';

import { Author } from '../../../models/v1/index.js';

export function update(request, response) {
    const { taxCode } = request.params;
    const { firstName, lastName } = request.body;

    const folderPath = '/var/www/author';

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
            const author = new Author({ taxCode, firstName, lastName });
            fs.writeFileSync(filePath, author.toString(), { flush: true });

            return response.status(200).json({ data: author });
        }

        return response.status(404).json({ message: 'Not found.' });
    } catch (exception) {
        console.error(exception);
        return response.status(500).json({ data: 'Error.' });
    }
}
