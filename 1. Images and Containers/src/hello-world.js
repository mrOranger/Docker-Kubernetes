const app = require('express');

const server = app();

server.get('/', (request, response) => {
    console.log(`Request incoming from ${request.host}`);
    return response.json('Hello World!');
});

server.listen(80, () => console.log('Listening on port 80'));
