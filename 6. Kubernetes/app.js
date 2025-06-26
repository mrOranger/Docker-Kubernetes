const express = require('express');
const app = express();

app.get('/', function (request, response) {
    return response.status(200).json({ message: 'Hello World!' });
});

app.get('/error', function (request, response) {
    return response.status(500).json({ message: 'error' });
});

app.listen(80, () => console.log('Application Listening on Port 80'));
