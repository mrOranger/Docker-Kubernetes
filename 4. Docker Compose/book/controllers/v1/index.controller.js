export function index(_, response) {
    const { DATABASE_URL, DATABASE_PORT, DATABASE_BASE_PATH } = process.env;

    const PATH = `${DATABASE_URL}:${DATABASE_PORT}/${DATABASE_BASE_PATH}`;

    fetch(`${PATH}`)
        .then((response) => response.json())
        .then((result) => response.status(200).json(result))
        .catch((result) => console.log(result))
        .finally((result) => response.status(500).json(result));
}
