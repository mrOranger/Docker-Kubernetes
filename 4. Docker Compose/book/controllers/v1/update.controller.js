export function update(request, response) {
    const { id } = request.params;
    const { DATABASE_URL, DATABASE_PORT, DATABASE_BASE_PATH } = process.env;

    const PATH = `${DATABASE_URL}:${DATABASE_PORT}/${DATABASE_BASE_PATH}/${id}`;

    const options = {
        method: 'PUT',
        body: JSON.stringify(request.body),
        headers: {
            'Content-Type': 'application/json',
        },
    };

    fetch(`${PATH}`, options)
        .then((response) => response.json())
        .then((result) => response.status(200).json(result))
        .catch((result) => response.status(500).json(result));
}
