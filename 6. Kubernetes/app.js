const express = require('express');
const app = express();

app.get('/', function (request, response) {
    const { ip, hostname, protocol } = request;
    return response.status(200).json({
        address: ip,
        host: hostname,
        httpProtocol: protocol
    });
});

app.get('/error', function (request, response) {
	process.exit(1);
    return esponse.status(500).json({ message: "Error" });
});

app.listen(80, () => console.log('Application Listening on Port 80'));
