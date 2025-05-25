const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get('/', (request, response) => {
    const folderPath = path.join(__dirname, 'documents');

    fs.readdir(folderPath, (error, files) => {
        if (error) {
            console.error(error);
            return;
        }

        let fileData = '';

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            try {
                const data = fs.readFileSync(filePath, 'utf-8');
                fileData = fileData.concat(data, '\n');
            } catch (exception) {
                return response
                    .status(500)
                    .json({ data: 'Error in saving the file!' });
            }
        }

        return response.status(201).json({ data: fileData });
    });
});

app.post('/', (request, response) => {
    const bodyContent = request.body.data;

    if (!bodyContent) {
        return res.status(400).json({ error: 'Unprocessable content!' });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}.dat`;
    const folderPath = path.join(__dirname, 'documents');

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, bodyContent, (err) => {
        if (err) {
            console.error(err);
            return response
                .status(500)
                .json({ data: 'Error in saving the file!' });
        }

        return response.status(201).json({ data: 'File saved successfully!' });
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
