export class Book {
    constructor({ id, title, year, authorId }) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.authorId = authorId;
    }

    toString() {
        return `{
            "id": "${this.id}",
            "title": "${this.title}",
            "year": ${this.year},
            "authorId": "${this.authorId}"
        }`;
    }
}
