const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 80;
const DATA_DIR = path.join(__dirname, 'books');

app.use(express.json());

function getTodayFilename() {
    const today = new Date().toISOString().split('T')[0]; 
    return path.join(DATA_DIR, `${today}.json`);
}

async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (err) {
        console.error('Errore nella creazione della cartella dei dati:', err);
    }
}

app.get('/book', async (req, res) => {
    await ensureDataDir();
    const filePath = getTodayFilename();

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const books = JSON.parse(data);
        res.json(books);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.json([]); 
        }
        console.error(err);
        res.status(500).json({ error: 'Errore nel leggere i dati.' });
    }
});

app.post('/book', async (req, res) => {
    const { title, publishedAt } = req.body;

    if (!title || !publishedAt) {
        return res.status(400).json({ error: 'Titolo e data di pubblicazione sono obbligatori.' });
    }

    const newBook = {
        id: uuidv4(),
        title,
        publishedAt
    };

    await ensureDataDir();
    const filePath = getTodayFilename();

    try {
        let books = [];

        try {
            const data = await fs.readFile(filePath, 'utf-8');
            books = JSON.parse(data);
        } catch (err) {
            if (err.code !== 'ENOENT') throw err; 
        }

        books.push(newBook);
        await fs.writeFile(filePath, JSON.stringify(books, null, 2), 'utf-8');

        res.status(201).json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel salvare il libro.' });
    }
});

app.patch('/error', function (request, response) {
    response.status(500).json({ 'message': 'Error' });
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`📚 Server in ascolto sulla porta ${PORT}`);
});

